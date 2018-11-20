import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import LocalGraph from '@/components/LocalGraph';

const UserProfile = ({ location }) => {
  const { email, name } = location.state;
  if (!email) {
    return (
      <Container>
        <Row>
          <Col lg={{ size: 3, offset: 5 }} sm={{ size: 3, offset: 5 }}>
            No user profile found.
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        <Col xs={{ size: 8, offset: 3 }} sm={{ size: 6, offset: 4 }} lg={{ size: 4, offset: 5 }} >
          {name}&apos;s Profile
        </Col>
      </Row>
      <Row>
        <Col>
          <LocalGraph email={email} />
        </Col>
      </Row>
    </Container>
  );
};

UserProfile.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

UserProfile.defaultProps = {
  location: {
    state: {
      email: '',
      name: '',
    },
  },
};

export default UserProfile;
