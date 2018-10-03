import styled from 'styled-components';

const IconButton = styled.button`
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

export default IconButton;
