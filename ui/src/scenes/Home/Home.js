import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import NeedsContainer from './components/NeedsContainer';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';

const Home = () => (
  <Container fluid>
    <Row>
      <Col lg={3} xs={12}>
        <NeedsContainer />
      </Col>
      <Col lg={3} xs={12}>
        <ResponsibilitiesContainer />
      </Col>
    </Row>
  </Container>
);

export default Home;
