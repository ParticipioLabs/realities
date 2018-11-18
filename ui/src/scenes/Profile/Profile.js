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
import withAuth from '@/components/withAuth';
import UpdateViewerName from './components/UpdateViewerName';
import UserGraph from './components/UserGraph';

const Profile = withAuth(({ auth }) => {
  if (!auth.isLoggedIn) return <Redirect to="/" />;
  return (
    <Container fluid>
      <Row>
        <Col lg={{ size: 6, offset: 3 }}>
          <Card>
            <CardBody>
              <h1>Profile</h1>
              <UpdateViewerName />
              <UserGraph />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
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
