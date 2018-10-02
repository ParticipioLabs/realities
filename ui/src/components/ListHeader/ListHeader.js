import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/lib/fa';

const StyledHeader = styled(Card)`
  background-color: ${props => props.color || '#999'};
  color: white;
  flex-direction: row;
  font-size: 1.25rem;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
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

const ListHeader = ({
  text,
  showButton,
  onButtonClick,
  color,
}) => (
  <StyledHeader color={color}>
    <ListHeaderText>
      {text}
    </ListHeaderText>
    { showButton &&
      <ListHeaderButton onClick={onButtonClick}>
        <FaPlus />
      </ListHeaderButton>
    }
  </StyledHeader>
);

ListHeader.propTypes = {
  text: PropTypes.string,
  showButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  color: PropTypes.string,
};

ListHeader.defaultProps = {
  text: '',
  showButton: false,
  onButtonClick: () => null,
  color: '',
};

export default ListHeader;
