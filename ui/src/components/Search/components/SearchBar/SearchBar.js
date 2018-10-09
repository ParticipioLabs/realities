import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import { FaTimesCircle } from 'react-icons/lib/fa';

const ClearButton = styled.button`
  background-color: white;
  border-bottom-right-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border: 1px solid #ced4da;
  color: rgba(0, 0, 0, 0.5);
  font-size: 1.25rem;
  line-height: 1.25rem;
  padding: 0 0.75rem;
  z-index: 1;
  &:hover, &:focus {
    outline: none;
    background-color: #f8f8f8;
    color: black;
  }
  &:active {
    background-color: white;
    color: rgba(0, 0, 0, 0.7);
  }
`;

const SearchBar = (props) => {
  const { onClear, ...inputProps } = props;
  return (
    <Form>
      <InputGroup>
        <Input placeholder="Search" {...inputProps} />
        <InputGroupAddon addonType="append">
          <ClearButton
            onClick={(e) => {
              e.preventDefault();
              onClear(e);
            }}
          >
            <FaTimesCircle />
          </ClearButton>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};

SearchBar.propTypes = {
  onClear: PropTypes.func,
};

SearchBar.defaultProps = {
  onClear: () => null,
};

export default SearchBar;
