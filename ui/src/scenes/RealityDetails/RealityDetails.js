import React from 'react';
import styled from 'styled-components';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import Search from 'components/Search';
import FullscreenDetailViewContainer from './components/FullscreenDetailViewContainer';

const SearchRow = styled(Row)`
  margin-bottom: 20px;
`;

const RealityDetails = () => (
  <Container fluid>
    <SearchRow className="d-md-none">
      <Col>
        <Search />
      </Col>
    </SearchRow>
    <Row>
      <Col md="1" />
      <Col md="10">
        <FullscreenDetailViewContainer />
      </Col>
      <Col md="1" />
    </Row>
  </Container>
);

export default RealityDetails;
