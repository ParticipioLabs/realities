import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import styled from 'styled-components';
import _ from 'lodash';

const RealitiesBadge = styled(Badge)`
  margin-right: .5em;
  background-color: ${ props => props.dependency.__typename === 'Need' ? '#00cf19' : '#843cfd' };
`

const DependencyList = function ({
  dependsOnNeeds,
  dependsOnResponsibilities,
  onSelectDependency,
  selectedDependency,
}) {
  const dependencies = _.concat(dependsOnResponsibilities, dependsOnNeeds);
  return (
    <div>
      <ListGroup>
        {dependencies && dependencies.map((dependency, i) => (

          <ListGroupItem
            key={i}
            tag="a"
            href="#"
            action
            active={dependency === selectedDependency}
            onClick={() => onSelectDependency(dependency)}
          >
            <RealitiesBadge dependency={dependency}>{dependency.__typename[0]}</RealitiesBadge>
            {dependency.title}
            {/*}This also works, see the custom scss file.
            <Badge color={
              dependency.__typename === 'Need' ? 'need' : 'responsibility'
            }>{dependency.__typename[0]}</Badge>{dependency.title} */}
          </ListGroupItem>
      ))}
      </ListGroup>
    </div>
  );
};

DependencyList.defaultProps = {
  dependsOnNeeds: [],
  dependsOnResponsibilities: [],
};

DependencyList.propTypes = {
  dependsOnNeeds: PropTypes.array,
  dependsOnResponsibilities: PropTypes.array,
  onSelectDependency: PropTypes.func.isRequired
};

export default DependencyList;
