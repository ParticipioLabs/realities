import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Form, Input, Badge } from 'reactstrap';
import styled from 'styled-components';
import _ from 'lodash';

import MdCancelIcon from 'react-icons/lib/md/cancel';

const CancelButton = styled.button`
  position: absolute;
  right: 0;
  top: 5px;
  background-color: transparent;
  border: none;
  color: rgba(0, 0, 0, .5);
  padding-top: 0;
  padding-bottom: 0;
  &:focus {
    outline: none;
  }
`;

const RealitiesBadge = styled(Badge)`
  margin-right: .5em;
  background-color: ${props => (props.node.__typename === 'Need' ? '#00cf19' : '#843cfd')};
`;

const SearchInput = styled(Input)`
  margin-bottom: 0.5em;
  padding-bottom: 0;
  font-size: large;
`;

const ListGroupPulldown = styled(ListGroup)`
  margin-top: -0.5em;
  padding-top: 0;
  z-index:10;
  width: 100%;
  position: absolute;
  box-shadow: 3px 3px 5px #999;
`;

class Search extends React.Component {
  state = {
    inputValue: '',
    selectedNodeTitle: null,
    isOpen: false,
  };

  changeHandler = selectedNodeItem =>
  {
    console.log('changeHandler', selectedNodeItem)
    const nodeTitle = selectedNodeItem ? selectedNodeItem.title : '';
    const inputValue = selectedNodeItem ? selectedNodeItem.title : '';
    this.setState({
      selectedNodeTitle: nodeTitle,
      inputValue: nodeTitle,
      isOpen: false,
    });

    if (selectedNodeItem.__typename === 'Need') {
      this.props.onSelectNeed(selectedNodeItem);
    } else if (selectedNodeItem.__typename === 'Responsibility') {
      this.props.onSelectResponsibility(selectedNodeItem);
    }
  }

  stateChangeHandler = changes =>
  {
    console.log('stateChangeHandler', changes);
    let {
      selectedItem = this.state.selectedNodeTitle,
      isOpen = this.state.isOpen,
      inputValue = this.state.inputValue,
      type,
      } = changes;
    //isOpen =
    //  type === Downshift.stateChangeTypes.mouseUp ? this.state.isOpen : isOpen;
    this.setState({
      selectedNodeTitle: selectedItem,
      isOpen,
      inputValue,
    })
  }

  handleInputChange = event =>
  {
    console.log('handleInputChange', event);
    const {value} = event.target
    const nextState = {inputValue: value}
    console.log('nextState', nextState);
    console.log('items', this.props.items)
    if (this.props.items.includes(value)) {
      nextState.selectedNodeTitle = value
    }
    this.setState(nextState)
  }

  clearSelection = () =>
  {
    console.log('clearSelection')
    console.log('inputValue', this.state.inputValue)
    this.setState({inputValue: '', selectedNodeTitle: null, isOpen: false, })
  }

  toggleMenu = () =>
  {
    this.setState(({isOpen}) => ({isOpen: !isOpen}))
  }

  //constructor(props)
  //{
  //  super(props);
  //
  //  console.log(this);
  //
  //  this.state = {
  //    inputValue: '',
  //  };
  //  this.handleChange = this.handleChange.bind(this);
  //  this.itemToString = this.itemToString.bind(this);
  //}

  //handleChange = (item) =>
  //{
  //  console.log('Got change', item);
  //  this.setState({selectedItem: item});
  //  try {
  //    this.setState({inputValue: item.title});
  //  } catch (err) {
  //    this.setState({inputValue: ''});
  //    return;
  //  }
  //
  //  if (item.__typename === 'Need') {
  //    this.props.onSelectNeed(item);
  //  } else if (item.__typename === 'Responsibility') {
  //    this.props.onSelectResponsibility(item);
  //  }
  //};

  itemToString = (item) =>
  {
    console.log('Convert to string:', item)
    return item ? item.name : '';
  };

  render()
  {
    //console.log('this.props.items', items)
    //console.log('this.selectedItem', this.state.selectedItem);
    //let selectedItem=this.state.selectedNodeTitle
    //let isOpen=this.state.isOpen
    //let inputValue=this.state.inputValue
    //let onChange= this.changeHandler
    //let onStateChange= this.stateChangeHandler
    //let onInputChange=this.handleInputChange
    //let items=this.props.items
    return (
      <ControlledAutocomplete
        selectedItem={this.state.selectedNodeTitle}
        items={this.props.items.sort()}
        isOpen={this.state.isOpen}
        inputValue={this.state.inputValue}
        onChange={this.changeHandler}
        onStateChange={this.stateChangeHandler}
        onInputChange={this.handleInputChange}
        onClearSelection={this.clearSelection}
        itemToString={this.itemToString}
      />
    );
  }
}

function ControlledAutocomplete({ onInputChange, onClearSelection, items, ...rest }) {
  return (
    <div>
      <Downshift
        { ...rest }
        render = {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
          }) => (
          <div style={{ position: 'relative' }}>
            <div>
              <SearchInput {...getInputProps({ placeholder: 'Search', onChange: onInputChange })} />
              { selectedItem || inputValue ? (
                <CancelButton onClick={onClearSelection}>
                <MdCancelIcon size={24} />
                </CancelButton>
                ) : null }
            </div>

            { isOpen && (
              <ListGroupPulldown>
                { items && items
                  .filter(
                    i =>
                  !inputValue ||
                  i.title.toLowerCase().includes(inputValue.toLowerCase())
                )
                  .map((item, index) => (
                    <ListGroupItem
                      key={item.nodeId}
                      {...getItemProps({
                        item,
                        index,
                        active: highlightedIndex === index,
                        action: selectedItem === item,
                      })
                        }
                    >
                      <RealitiesBadge node={item}>{ item.__typename[0] }</RealitiesBadge> { item.title }
                    </ListGroupItem>
                  )) }
              </ListGroupPulldown>)
              }
          </div>
        )}
      />
    </div>
  );
}

Search.defaultProps = {
  items: [],
};

Search.propTypes = {
  items: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onSelectNeed: PropTypes.func.isRequired,
  onSelectResponsibility: PropTypes.func.isRequired,
};

export default Search;
