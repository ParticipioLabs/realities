import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
} from 'reactstrap';

const Controls = ({ highlightedEdge, onSelectHighlightedEdge }) => (
  <Card>
    <CardHeader>Highlighted relationship</CardHeader>
    <CardBody>
      <ButtonGroup>
        <Button
          color="primary"
          onClick={() => onSelectHighlightedEdge('realizes')}
          outline={highlightedEdge !== 'realizes'}
        >
          Realizes
        </Button>
        <Button
          color="primary"
          onClick={() => onSelectHighlightedEdge('guides')}
          outline={highlightedEdge !== 'guides'}
        >
          Guides
        </Button>
        <Button
          color="primary"
          onClick={() => onSelectHighlightedEdge('depends_on')}
          outline={highlightedEdge !== 'depends_on'}
        >
          Depends on
        </Button>
      </ButtonGroup>
    </CardBody>
  </Card>
);

Controls.propTypes = {
  highlightedEdge: PropTypes.oneOf(['realizes', 'guides', 'depends_on']).isRequired,
  onSelectHighlightedEdge: PropTypes.func.isRequired,
};

export default Controls;
