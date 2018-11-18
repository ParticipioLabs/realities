import React from 'react';
import { string } from 'prop-types';
import styled from 'styled-components';
import LocalGraph from '@/components/LocalGraph';

const CardSection = styled.div`
  margin-bottom: 1rem;
`;

const UserGraph = ({ email }) => (
  <CardSection>
    <div>User Graph</div>
    <LocalGraph
      nodeId="0f6180cd-1c0f-4150-905a-06fbc3d9d35e"
      nodeType="Person"
      email={email}
    />
  </CardSection>
);

UserGraph.propTypes = {
  email: string,
};

UserGraph.defaultProps = {
  email: '',
};

export default UserGraph;
