import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Downshift from 'downshift';
import { Input } from 'reactstrap';
import TypeaheadResultsContainer from './components/TypeaheadResultsContainer';

const Wrapper = styled.span`
  display: block;
  position: relative;
`;

const TypeaheadInput = ({
  name,
  id,
  selectedItem,
  itemToString,
  searchQuery,
  queryDataToResultsArray,
  disabled,
  onChange,
  onBlur,
  invalid,
}) => (
  <Downshift
    selectedItem={selectedItem}
    onChange={onChange}
    itemToString={itemToString}
  >
    {({
      getRootProps,
      getInputProps,
      getMenuProps,
      getItemProps,
      inputValue,
      highlightedIndex,
      isOpen,
    }) => (
      <Wrapper {...getRootProps({ refKey: 'innerRef' })}>
        <Input
          {...getInputProps({
            name,
            id,
            disabled,
            onBlur,
            invalid,
          })}
        />
        {isOpen && (
          <TypeaheadResultsContainer
            {...{
              inputValue,
              getMenuProps,
              getItemProps,
              highlightedIndex,
              itemToString,
              searchQuery,
              queryDataToResultsArray,
            }}
          />
        )}
      </Wrapper>
    )}
  </Downshift>
);

TypeaheadInput.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  selectedItem: PropTypes.shape({
    nodeId: PropTypes.string,
  }),
  itemToString: PropTypes.func,
  searchQuery: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  queryDataToResultsArray: PropTypes.func,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  invalid: PropTypes.bool,
};

TypeaheadInput.defaultProps = {
  name: '',
  id: '',
  selectedItem: {
    nodeId: '',
  },
  itemToString: () => '',
  searchQuery: {},
  queryDataToResultsArray: () => [],
  disabled: false,
  onChange: () => null,
  onBlur: () => null,
  invalid: false,
};

export default TypeaheadInput;
