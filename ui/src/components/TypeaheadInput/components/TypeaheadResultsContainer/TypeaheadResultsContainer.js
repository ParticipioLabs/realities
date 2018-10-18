import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { Card, CardBody } from 'reactstrap';
import withDebouncedProp from '@/components/withDebouncedProp';
import WrappedLoader from '@/components/WrappedLoader';
import TypeaheadResults from './components/TypeaheadResults';

const Wrapper = styled(Card)`
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  left: 0;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 10;
`;

const TypeaheadResultsContainer = withDebouncedProp('inputValue', 250)(({
  inputValue,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  itemToResult,
  searchQuery,
  queryDataToResultsArray,
}) => {
  if (!inputValue) return null;
  return (
    <Wrapper>
      <Query
        query={searchQuery}
        variables={{ term: inputValue }}
        fetchPolicy="no-cache"
      >
        {({ loading, error, data }) => {
          if (loading) return <WrappedLoader />;
          if (error) return <CardBody>`Error! ${error.message}`</CardBody>;
          const searchResults = queryDataToResultsArray(data) || [];
          if (searchResults.length === 0) return <CardBody>No results</CardBody>;
          return (
            <TypeaheadResults
              results={searchResults}
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
              itemToResult={itemToResult}
            />
          );
        }}
      </Query>
    </Wrapper>
  );
});

TypeaheadResultsContainer.propTypes = {
  inputValue: PropTypes.string,
  getMenuProps: PropTypes.func,
  getItemProps: PropTypes.func,
  highlightedIndex: PropTypes.number,
  itemToResult: PropTypes.func,
  searchQuery: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  queryDataToResultsArray: PropTypes.func,
};

TypeaheadResultsContainer.defaultProps = {
  inputValue: '',
  getMenuProps: () => {},
  getItemProps: () => {},
  highlightedIndex: null,
  itemToResult: () => '',
  searchQuery: {},
  queryDataToResultsArray: () => [],
};

export default TypeaheadResultsContainer;
