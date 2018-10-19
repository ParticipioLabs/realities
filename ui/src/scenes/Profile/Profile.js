import React from 'react';
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import UpdateViewerName from './components/UpdateViewerName';

const Profile = () => (
  <Container fluid>
    <Row>
      <Col lg={{ size: 6, offset: 3 }}>
        <Card>
          <CardBody>
            <h1>Profile</h1>
            <UpdateViewerName />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Profile;
