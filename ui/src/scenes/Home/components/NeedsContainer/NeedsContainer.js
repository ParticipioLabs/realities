import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import NeedsList from './components/NeedsList';

const GET_NEEDS = gql`
  {
    needs {
      nodeId
      title
    }
  }
`;

const NeedsContainer = withRouter(({ match }) => (
  <Query query={GET_NEEDS}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <Container fluid>
          <Row>
            <Col lg={3} xs={12}>
              <NeedsList needs={data.needs} selectedNeedId={match.params.needId} />
            </Col>
            <Col lg={9} xs={12}>
              Responsibilities
            </Col>
          </Row>
        </Container>
      );
    }}
  </Query>
));

NeedsContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
    }),
  }),
};

NeedsContainer.defaultProps = {
  match: {
    params: {
      needId: undefined,
    },
  },
};

export default NeedsContainer;
