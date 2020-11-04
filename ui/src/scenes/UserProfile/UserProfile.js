import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import LocalGraph from 'components/LocalGraph';
import WrappedLoader from 'components/WrappedLoader';

const GET_PERSON = gql`
  query UserProfile_getPerson($nodeId: ID!) {
    person(nodeId:$nodeId){
      name
      __typename
    }
  }
`;

const UserProfile = withRouter(({ match }) => {
  const { personId } = match.params;
  const { loading, data } = useQuery(GET_PERSON, { variables: { nodeId: personId } });

  if (loading) return <WrappedLoader />;
  if (!data.person) {
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
        <Col
          xs={{ size: 8, offset: 3 }}
          sm={{ size: 6, offset: 4 }}
          lg={{ size: 4, offset: 5 }}
        >
          {data.person.name}&apos;s Profile
        </Col>
      </Row>
      <Row>
        <Col>
          <LocalGraph nodeId={personId} nodeType={data.person.__typename} />
        </Col>
      </Row>
    </Container>
  );
});

UserProfile.propTypes = {
  match: PropTypes.shape({
    personId: PropTypes.string,
  }),
};

UserProfile.defaultProps = {
  match: {
    personId: '',
  },
};

export default UserProfile;
