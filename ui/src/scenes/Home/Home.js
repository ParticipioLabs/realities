import React from 'react';
import styled from 'styled-components';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import Search from 'components/Search';
import NeedsContainer from './components/NeedsContainer';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';
import DetailViewContainer from './components/DetailViewContainer';

const SearchRow = styled(Row)`
  margin-bottom: 20px;
`;

const Home = () => (
  <Container fluid>
    <SearchRow className="d-md-none">
      <Col>
        <Search />
      </Col>
    </SearchRow>
    <Row>
      <Col md="6">
        <Row>
          <Col lg="6">
            <NeedsContainer />
          </Col>
          <Col lg="6">
            <ResponsibilitiesContainer />
          </Col>
        </Row>
      </Col>
      <Col md="6">
        <DetailViewContainer />
      </Col>
    </Row>
  </Container>
);

export default Home;
