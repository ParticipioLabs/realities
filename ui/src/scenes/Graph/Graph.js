import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import gql from 'graphql-tag';
import graphUtils from '@/services/graphUtils';
import { Query } from '@apollo/client/react/components';
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import VisGraph from 'react-graph-vis';
import WrappedLoader from '@/components/WrappedLoader';
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

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightedEdge: 'realizes',
      selectedNode: null,
    };
  }

  onSelectNode = ({ nodes }, graphData) => {
    const selectedNodeId = nodes && nodes[0];
    const graphNode = _.find(graphData.nodes, { id: selectedNodeId });
    this.setState({ selectedNode: graphNode });
  };

  handleSelectHighlightedEdge = highlightedEdge => this.setState({ highlightedEdge });

  render() {
    const { highlightedEdge, selectedNode } = this.state;

    return (
      <Container fluid>
        <Row>
          <Col md="3">
            <ControlsRow>
              <Col>
                <Controls
                  highlightedEdge={highlightedEdge}
                  onSelectHighlightedEdge={this.handleSelectHighlightedEdge}
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
                <Query query={GET_RESPONSIBILITIES}>
                  {({ loading, error, data }) => {
                    if (loading) return <WrappedLoader />;
                    if (error) return `Error! ${error.message}`;
                    const graphData = graphUtils.getMasterGraph(data, highlightedEdge);
                    return (
                      <VisGraph
                        graph={graphData}
                        options={graphOptions}
                        events={{ select: event => this.onSelectNode(event, graphData) }}
                        style={{ height: 'calc(100vh - 100px)' }}
                      />
                    );
                  }}
                </Query>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Graph;
