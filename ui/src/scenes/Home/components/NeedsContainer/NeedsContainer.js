import React from 'react';
import gql from 'graphql-tag';
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

const NeedsContainer = () => (
  <Query query={GET_NEEDS}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <Container fluid>
          <Row>
            <Col lg={3} xs={12}>
              <NeedsList needs={data.needs} />
            </Col>
            <Col lg={9} xs={12}>
              Responsibilities
            </Col>
          </Row>
        </Container>
      );
    }}
  </Query>
);

export default NeedsContainer;
