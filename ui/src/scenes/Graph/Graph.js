import React from 'react';
import gql from 'graphql-tag';
import graphUtils from '@/services/graphUtils';
import { Query } from 'react-apollo';
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import VisGraph from 'react-graph-vis';
import WrappedLoader from '@/components/WrappedLoader';

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
        title
      }
    }
  }
`;

const graphOptions = {
  layout: {
    improvedLayout: true,
  },
  edges: {
    color: '#000000',
    font: {
      align: 'top',
    },
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 0.5,
    },
  },
  nodes: {
    shape: 'dot',
  },
  physics: {
    enabled: false,
  },
};

const Graph = () => (
  <Container fluid>
    <Row>
      <Col>
        <Card>
          <CardBody>
            <Query query={GET_RESPONSIBILITIES}>
              {({ loading, error, data }) => {
                if (loading) return <WrappedLoader />;
                if (error) return `Error! ${error.message}`;
                const graphData = graphUtils.getMasterGraph(data);
                console.log(data);
                console.log(graphData);
                return (
                  <div>
                    <VisGraph
                      graph={graphData}
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

export default Graph;
