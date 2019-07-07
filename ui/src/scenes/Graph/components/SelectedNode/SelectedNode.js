import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
} from 'reactstrap';
import PersonDetailsContainer from './components/PersonDetailsContainer';
import ResponsibilityDetailsContainer from './components/ResponsibilityDetailsContainer';

const SelectedNodeDetailsContainer = ({ nodeId, nodeType }) => (
  <Card>
    <CardHeader>Selected node</CardHeader>
    <CardBody>
      {nodeId ? (
        <Fragment>
          {nodeType === 'Person' && (
            <PersonDetailsContainer nodeId={nodeId} />
          )}
          {nodeType === 'Responsibility' && (
            <ResponsibilityDetailsContainer nodeId={nodeId} />
          )}
        </Fragment>
      ) : (
        <CardText className="text-muted font-italic">
          Click a node to see details
        </CardText>
      )}
    </CardBody>
  </Card>
);

SelectedNodeDetailsContainer.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
};

SelectedNodeDetailsContainer.defaultProps = {
  nodeId: null,
  nodeType: null,
};

export default SelectedNodeDetailsContainer;
