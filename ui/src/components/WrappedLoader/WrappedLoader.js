import React from 'react';
import styled from 'styled-components';
import Loader from 'react-loader';

const Wrapper = styled.div`
  height: 5rem;
  position: relative;
`;

const WrappedLoader = () => (
  <Wrapper>
    <Loader
      options={{
        color: '#aaa',
        length: 5,
        radius: 5,
        width: 2,
      }}
    />
  </Wrapper>
);

export default WrappedLoader;
