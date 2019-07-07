import React, { Component } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import graphUtils from '@/services/graphUtils';
import { Query } from 'react-apollo';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import VisGraph from 'react-graph-vis';
import WrappedLoader from '@/components/WrappedLoader';

const LegendWrapper = styled.div`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  z-index: 10;
`;

const Label = styled.p`
  margin-bottom: 0.5em;
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
    };
  }

  handleSelectHighlightedEdge = highlightedEdge => this.setState({ highlightedEdge });

  render() {
    const { highlightedEdge } = this.state;

    return (
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Query query={GET_RESPONSIBILITIES}>
                  {({ loading, error, data }) => {
                    if (loading) return <WrappedLoader />;
                    if (error) return `Error! ${error.message}`;
                    return (
                      <div>
                        <LegendWrapper>
                          <Card>
                            <CardBody>
                              <Label>Hightlight relationship</Label>
                              <ButtonGroup>
                                <Button
                                  color="primary"
                                  onClick={() => this.handleSelectHighlightedEdge('realizes')}
                                  outline={highlightedEdge !== 'realizes'}
                                >
                                  Realizes
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() => this.handleSelectHighlightedEdge('guides')}
                                  outline={highlightedEdge !== 'guides'}
                                >
                                  Guides
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() => this.handleSelectHighlightedEdge('depends_on')}
                                  outline={highlightedEdge !== 'depends_on'}
                                >
                                  Depends on
                                </Button>
                              </ButtonGroup>
                            </CardBody>
                          </Card>
                        </LegendWrapper>
                        <VisGraph
                          graph={graphUtils.getMasterGraph(data, highlightedEdge)}
                          options={graphOptions}
                          style={{ height: 'calc(100vh - 100px)' }}
                        />
                      </div>
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
