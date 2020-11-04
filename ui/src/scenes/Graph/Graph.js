import React, { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import graphUtils from 'services/graphUtils';
import { gql, useQuery } from '@apollo/client';
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import VisGraph from 'react-graph-vis';
import WrappedLoader from 'components/WrappedLoader';
import Controls from './components/Controls';
import SelectedNode from './components/SelectedNode';

const ControlsRow = styled(Row)`
  margin-bottom: 8px;
`;

const GET_RESPONSIBILITIES = gql`
  query Graph_responsibilities {
    responsibilities {
      nodeId
      title
      realizer {
        nodeId
        name
        email
      }
      guide {
        nodeId
        name
        email
      }
      dependsOnResponsibilities {
        nodeId
      }
    }
  }
`;

const graphOptions = {
  nodes: {
    shape: 'dot',
  },
  physics: {
    enabled: false,
  },
  edges: {
    arrowStrikethrough: false,
  },
};


const Graph = () => {
  const [highlightedEdge, setHighlightedEdge] = useState('realizes');
  const [selectedNode, setSelectedNode] = useState(null);
  const { loading, error, data } = useQuery(GET_RESPONSIBILITIES);

  const onSelectNode = ({ nodes }, graphData) => {
    const selectedNodeId = nodes && nodes[0];
    const graphNode = _.find(graphData.nodes, { id: selectedNodeId });
    setSelectedNode(graphNode);
  };

  return (
    <Container fluid>
      <Row>
        <Col md="3">
          <ControlsRow>
            <Col>
              <Controls
                highlightedEdge={highlightedEdge}
                onSelectHighlightedEdge={setHighlightedEdge}
              />
            </Col>
          </ControlsRow>
          <Row>
            <Col>
              <SelectedNode
                nodeId={selectedNode && selectedNode.id}
                nodeType={selectedNode && selectedNode.__typename}
              />
            </Col>
          </Row>
        </Col>
        <Col md="9">
          <Card>
            <CardBody>
              {(() => {
                if (loading) return <WrappedLoader />;
                if (error) return `Error! ${error.message}`;

                const graphData = graphUtils.getMasterGraph(data, highlightedEdge);
                return (
                  <VisGraph
                    graph={graphData}
                    options={graphOptions}
                    events={{ select: event => onSelectNode(event, graphData) }}
                    style={{ height: 'calc(100vh - 100px)' }}
                  />
                );
              })()}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Graph;
