import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import NeedsContainer from './components/NeedsContainer';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';
import DetailViewContainer from './components/DetailViewContainer';

const Home = () => (
  <Container fluid>
    <Row>
      <Col lg={3} xs={12}>
        <NeedsContainer />
      </Col>
      <Col lg={3} xs={12}>
        <ResponsibilitiesContainer />
      </Col>
      <Col lg={6} xs={12}>
        <DetailViewContainer />
      </Col>
    </Row>
  </Container>
);

export default Home;
