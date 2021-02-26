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
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/Edgeryders-Participio/realities">Realities</a>
    {' '}
    is a tool for tribal decentralised organisations. It is a part of
    {' '}
    <a target="_blank" rel="noopener noreferrer" href="https://www.platoproject.org/">Plato Project</a>
    .
  </StyledFooter>
);

export default RealitiesFooter;
