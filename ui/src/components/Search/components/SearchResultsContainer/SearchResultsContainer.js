import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import _ from 'lodash';
import { Query } from 'react-apollo';
import { Card, CardBody } from 'reactstrap';
import withDebouncedProp from '@/components/withDebouncedProp';
import WrappedLoader from '@/components/WrappedLoader';
import SearchResults from './components/SearchResults';

const GET_SEARCH = gql`
  query Search_searchNeedsAndResponsibilities($term: String!) {
    searchNeedsAndResponsibilities(term: $term) {
      needs {
        nodeId
        title
      }
      responsibilities {
        nodeId
        title
        fulfills {
          nodeId
        }
      }
    }
  }
`;

const Wrapper = styled(Card)`
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  left: 0;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 10;
`;

const SearchResultsContainer = withDebouncedProp('searchTerm', 250)(({
  searchTerm,
  getMenuProps,
  getItemProps,
  highlightedIndex,
}) => {
  if (!searchTerm) return null;
  return (
    <Wrapper>
      <Query
        query={GET_SEARCH}
        variables={{ term: searchTerm }}
        fetchPolicy="no-cache"
      >
        {({ loading, error, data }) => {
          if (loading) return <WrappedLoader />;
          if (error) return <CardBody>`Error! ${error.message}`</CardBody>;
          const searchResultObject = data.searchNeedsAndResponsibilities || {};
          const searchResults = [
            ...(searchResultObject.needs || []),
            ...(searchResultObject.responsibilities || []),
          ];
          if (searchResults.length === 0) return <CardBody>No results</CardBody>;
          return (
            <SearchResults
              results={_.orderBy(searchResults, [r => r.title.toLowerCase()], ['asc'])}
              getMenuProps={getMenuProps}
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
            />
          );
        }}
      </Query>
    </Wrapper>
  );
});

SearchResultsContainer.propTypes = {
  searchTerm: PropTypes.string,
  getMenuProps: PropTypes.func,
  getItemProps: PropTypes.func,
  highlightedIndex: PropTypes.number,
};

SearchResultsContainer.defaultProps = {
  searchTerm: '',
  getMenuProps: () => {},
  getItemProps: () => {},
  highlightedIndex: null,
};

export default SearchResultsContainer;
