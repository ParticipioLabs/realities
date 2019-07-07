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
                return (
                  <div>
                    <VisGraph
                      graph={graphUtils.getMasterGraph(data)}
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
