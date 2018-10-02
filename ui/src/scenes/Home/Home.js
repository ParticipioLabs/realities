import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from 'reactstrap';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/lib/fa';
import withAuth from '@/components/withAuth';
import colors from '@/styles/colors';
import NeedsContainer from './components/NeedsContainer';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';
import DetailViewContainer from './components/DetailViewContainer';

const ListHeader = styled(Card)`
  font-size: 1.25rem;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  margin-bottom: 0.5rem;
`;

const ListHeaderText = styled.span`
  line-height: 2.1rem;
`;

const ListHeaderButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;
  color: white;
  &:hover, &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const NeedsListHeader = ListHeader.extend`
  background-color: ${colors.need};
`;

const ResponsibilitiesListHeader = ListHeader.extend`
  background-color: ${colors.responsibility};
`;

const Home = withAuth(({ auth }) => (
  <Container fluid>
    <Row>
      <Col lg={3} xs={12}>
        <NeedsListHeader>
          <ListHeaderText>
            Needs
          </ListHeaderText>
          { auth.isLoggedIn &&
            <ListHeaderButton>
              <FaPlus />
            </ListHeaderButton>
          }
        </NeedsListHeader>
        <NeedsContainer />
      </Col>
      <Col lg={3} xs={12}>
        <ResponsibilitiesListHeader>
          <ListHeaderText>
            Responsibilities
          </ListHeaderText>
          { auth.isLoggedIn &&
            <ListHeaderButton>
              <FaPlus />
            </ListHeaderButton>
          }
        </ResponsibilitiesListHeader>
        <ResponsibilitiesContainer />
      </Col>
      <Col lg={6} xs={12}>
        <DetailViewContainer />
      </Col>
    </Row>
  </Container>
));

Home.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};

Home.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
};

export default Home;
