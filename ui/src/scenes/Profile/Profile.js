import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import withAuth from '@/components/withAuth';
import WrappedLoader from '@/components/WrappedLoader';
import UpdateViewerName from './components/UpdateViewerName';
import LocalGraph from './components/LocalGraph';


const nodeType = 'Need';
const nodeId = '81072a8d-9c9a-4676-bb04-ccc2dea0baf0';
const GET_VIEWER_NAME = gql`
  query UpdateViewerName_person($email: String!) {
    person(email: $email) {
      nodeId
      name
    }
  }
`;


const Profile = withAuth(({ auth }) => {
  if (!auth.isLoggedIn) return <Redirect to="/" />;
  return (
    <Query
      query={GET_VIEWER_NAME}
      variables={{ email: auth.email }}
    >
      {({
          loading,
          error,
          data,
          }) => {
            if (loading) return <WrappedLoader />;
            if (error) return `Error! ${error.message}`;
                console.log('data', data);
                  return (
                    <Container fluid>
                      <Row>
                        <Col lg={{ size: 6, offset: 3 }}>
                          <Card>
                            <CardBody>
                              <h1>Profile</h1>
                              <UpdateViewerName />
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody>
                              <h1>Graph</h1>
                              <LocalGraph nodeType={data.__typename} nodeId={data.nodeId} />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </Container>
  );
                 }}
    </Query>
  );
});

Profile.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};

Profile.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
};

export default Profile;
