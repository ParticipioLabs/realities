import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  border-top: solid 1px #eee;
  font-size: small;
  height: 5em;
  margin-top: 2em;
  padding-bottom: 1em;
  padding-top: 1em;
  text-align: center;
`;

const RealitiesFooter = () => (
  <StyledFooter className="text-muted">
    A tool for tribal decentralised organisations.
  </StyledFooter>
);

export default RealitiesFooter;
