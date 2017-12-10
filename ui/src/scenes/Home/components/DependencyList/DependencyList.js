import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import styled from 'styled-components';
import _concat from 'lodash';

const RealitiesListGroupItem = styled(ListGroupItem)`
  .active {
    background-color: #00cf19;
    color: #fff;
    }
`
const DependencyList = function({ dependsOnNeeds, dependsOnResponsibilities, onSelectDependency, selectedDependency }) {
  const dependencies = _concat(dependsOnNeeds, dependsOnResponsibilities)
  console.log(dependencies)
  return (
  <div>
    <ListGroup>
      {dependencies && dependencies.map((dependency, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <RealitiesListGroupItem
          key={i}
          className={dependency === selectedDependency && "active"}
          onClick={() => onSelectDependency(dependency)}>
          {dependency.title}
        </RealitiesListGroupItem>
      ))}
    </ListGroup>
  </div>
)};

DependencyList.defaultProps = {
  dependsOnNeeds: [],
  dependsOnResponsibilities: []
};

DependencyList.propTypes = {
  dependsOnNeeds: PropTypes.array,
  dependsOnResponsibilities: PropTypes.array
};

export default DependencyList;
