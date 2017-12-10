import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';

const NeedsList = ({ data: { needs } }) => (
  <div>
    <h4>Needs feched from backend:</h4>
    <ListGroup>
      {needs && needs.map((need, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListGroupItem key={i}>
          {need.title}
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
);

NeedsList.defaultProps = {
  data: {
    needs: [],
  },
};

NeedsList.propTypes = {
  data: PropTypes.shape({
    needs: PropTypes.array,
  }),
};

export default graphql(gql`
  query NeedsListQuery {
    needs {
      title
    }
  }
`)(NeedsList);
