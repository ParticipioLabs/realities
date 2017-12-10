import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
import styled from 'styled-components';

const GreenText = styled.p`
  color: green;
`;

const OurOwnButton = styled(Button)`
  background-color: #f0f;
`;

const About = () => (
  <Container fluid>
    <Row>
      <Col>
        <h1>About</h1>
        <GreenText>A tool for tribal decentralised organisations.</GreenText>
        <OurOwnButton>Hey!</OurOwnButton>
      </Col>
    </Row>
  </Container>
);

export default About;
