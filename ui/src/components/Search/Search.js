import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Downshift from 'downshift';
import SearchBar from './components/SearchBar';
import SearchResultsContainer from './components/SearchResultsContainer';

const Wrapper = styled.div`
  position: relative;
`;

const Search = withRouter(({ history }) => (
  <Downshift
    onChange={(node, { reset, clearSelection }) => {
      clearSelection();
      reset();
      if (node) {
        switch (node.__typename) {
          case 'Need':
            history.push(`/${node.nodeId}`);
            break;
          case 'Responsibility':
            history.push(`/${node.fulfills.nodeId}/${node.nodeId}`);
            break;
          case 'Person':
            history.push('/userprofile', { email: node.email, name: node.name });
            break;
          default:
            history.push('/');
        }
      }
    }}
    itemToString={i => (i && i.title) || ''}
  >
    {({
      getRootProps,
      getInputProps,
      getMenuProps,
      getItemProps,
      inputValue,
      highlightedIndex,
      isOpen,
      reset,
    }) => (
      <Wrapper {...getRootProps({ refKey: 'innerRef' })}>
        <SearchBar
          onClear={() => reset()}
          {...getInputProps({ onBlur: e => e.preventDefault() })}
        />
        {isOpen && (
          <SearchResultsContainer
            searchTerm={inputValue}
            getMenuProps={getMenuProps}
            getItemProps={getItemProps}
            highlightedIndex={highlightedIndex}
          />
        )}
      </Wrapper>
    )}
  </Downshift>
));

Search.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

Search.defaultProps = {
  history: {
    push: () => null,
  },
};

export default Search;
