import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import ExampleReusedComponent from '@/components/ExampleReusedComponent';

const Home = () => (
  <Container fluid>
    <Row>
      <Col>
        <h1>Home</h1>
        <p>Hello Borderlings!</p>
        <ExampleReusedComponent />
      </Col>
    </Row>
  </Container>
);

export default Home;
