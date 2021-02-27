import React from 'react';
import styled from 'styled-components';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import Search from 'components/Search';
import DetailViewContainer from 'components/DetailViewContainer';
import NeedsContainer from './components/NeedsContainer';

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
      <Col md="6" lg={{ size: 4, offset: 1 }}>
        <NeedsContainer />
      </Col>
      <Col md="6">
        <DetailViewContainer viewResp={false} />
        <DetailViewContainer viewResp />
      </Col>
    </Row>
  </Container>
);

export default Home;
