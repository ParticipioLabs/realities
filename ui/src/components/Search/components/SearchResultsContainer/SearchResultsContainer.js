import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import _ from 'lodash';
import { Query } from 'react-apollo';
import { Card, CardBody } from 'reactstrap';
import WrappedLoader from '@/components/WrappedLoader';
import SearchResults from './components/SearchResults';

const GET_SEARCH = gql`
  query Search_search($term: String!) {
    search(term: $term) {
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

class SearchResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { debouncedSearchTerm: props.searchTerm };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      if (!this.props.searchTerm) {
        this.handleSearchTermUpdateDebounced.cancel();
        this.setState({ debouncedSearchTerm: this.props.searchTerm });
      } else {
        this.handleSearchTermUpdateDebounced(this.props.searchTerm);
      }
    }
  }

  componentWillUnmount() {
    this.handleSearchTermUpdateDebounced.cancel();
  }

  handleSearchTermUpdateDebounced = _.debounce((searchTerm) => {
    this.setState({ debouncedSearchTerm: searchTerm });
  }, 250);

  render() {
    if (!this.state.debouncedSearchTerm) return null;

    return (
      <Wrapper>
        <Query
          query={GET_SEARCH}
          variables={{ term: this.state.debouncedSearchTerm }}
          fetchPolicy="no-cache"
        >
          {({ loading, error, data }) => {
            if (loading) return <WrappedLoader />;
            if (error) return <CardBody>`Error! ${error.message}`</CardBody>;
            const searchResults = [
              ...((data.search && data.search.needs) || []),
              ...((data.search && data.search.responsibilities) || []),
            ];
            if (searchResults.length === 0) return <CardBody>No results</CardBody>;
            return (
              <SearchResults
                results={_.orderBy(searchResults, [r => r.title.toLowerCase()], ['asc'])}
                getMenuProps={this.props.getMenuProps}
                getItemProps={this.props.getItemProps}
                highlightedIndex={this.props.highlightedIndex}
              />
            );
          }}
        </Query>
      </Wrapper>
    );
  }
}

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
