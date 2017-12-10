import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import ExampleReusedComponent from '@/components/ExampleReusedComponent';
import NeedsList from './components/NeedsList';

const Home = () => (
  <Container fluid>
    <Row>
      <Col>
        <h1>Home</h1>
      </Col>
    </Row>
    <Row>
      <Col>
        <p>Hello Borderlings!</p>
        <ExampleReusedComponent />
      </Col>
      <Col>
        <NeedsList />
      </Col>
    </Row>
  </Container>
);

export default Home;
