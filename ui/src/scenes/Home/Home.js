import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import styled from 'styled-components';
import {
  Container,
  Row,
  Col,
  Form,
  Input,
} from 'reactstrap';
import _ from 'lodash';
import CreateNeed from './components/CreateNeed';
import NeedsList from './components/NeedsList';
import ResponsibilitiesList from './components/ResponsibilitiesList';
import DetailView from './components/DetailView';

const SearchForm = styled(Form)`
  margin-bottom: 1em;
  font-size: large;
`;

const Footer = styled.footer`
  margin-top: 1em;
  font-size: small;
  text-align: center;
  border-top: solid 1px #eee;
`;

class Home extends React.Component {
  constructor() {
    super();
    this.state = { selectedNeed: null, selectedResponsibility: null, newNeed: false };
    this.onSelectNeed = this.onSelectNeed.bind(this);
    this.toggleCreateNewNeed = this.toggleCreateNewNeed.bind(this);
    this.onSelectResponsibility = this.onSelectResponsibility.bind(this);
    this.onSelectDependency = this.onSelectDependency.bind(this);
    this.createNewResponsibility = this.createNewResponsibility.bind(this);
  }

  onSelectNeed(need) {
    this.setState({ selectedNeed: need, selectedResponsibility: null });
  }

  onSelectResponsibility(responsibility) {
    this.setState({ selectedResponsibility: responsibility });
  }

  onSelectDependency(dependency) {
    const needsPromise = new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
      resolve(this.props.data.needs);
    });
    needsPromise
      .then((needs) => {
        if (dependency.__typename === 'Responsibility') {
          try {
            const need = _.find(needs, o => o.nodeId === dependency.fulfills.nodeId);
            const responsibility = _.find(need.fulfilledBy, o => o.nodeId === dependency.nodeId);
            this.onSelectNeed(need);
            this.onSelectResponsibility(responsibility);
          } catch (err) {
            console.log(err);
          }
        } else {
          const need = _.find(needs, o => o.nodeId === dependency.nodeId);
          this.onSelectNeed(need);
        }
      });
  }

  toggleCreateNewNeed(newNeed) {
    if (newNeed) {
      const { nodeId } = newNeed;
      const awaitNewNeeds = async () => {
        try {
          await this.props.data.refetch();
          const need = this.props.data.needs.find(n => n.nodeId === nodeId);
          this.onSelectNeed(need);
        } catch (err) {
          console.log(err);
        }
      };
      awaitNewNeeds();
    }
    this.setState({ newNeed: !this.state.newNeed });
  }

  createNewResponsibility() {
    this.setState({});

    // this.setState({ newResponsibility: true });
  }

  render() {
    const { newNeed } = this.state;
    const { needs } = this.props.data;
    return (
      <Container fluid>
        <Row>
          <Col lg={6} xs={12}>
            <SearchForm>
              <Input
                bsSize="lg"
                placeholder="Search for Need or Responsibility"
              />
            </SearchForm>
            <Row>
              <Col>
                <CreateNeed
                  needs={needs}
                  newNeed={newNeed}
                  onSelectNeed={this.onSelectNeed}
                  toggleCreateNewNeed={this.toggleCreateNewNeed}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6} xs={12}>
                <NeedsList
                  needs={needs}
                  onSelectNeed={this.onSelectNeed}
                  selectedNeed={this.state.selectedNeed}
                  toggleCreateNewNeed={this.toggleCreateNewNeed}
                />
              </Col>
              <Col lg={6} xs={12}>
                <ResponsibilitiesList
                  responsibilities={
                    this.state.selectedNeed &&
                    this.state.selectedNeed.fulfilledBy
                  }
                  onSelectResponsibility={this.onSelectResponsibility}
                  selectedResp={this.state.selectedResponsibility}
                  createNewResponsibility={this.createNewResponsibility}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <DetailView
              sm={12}
              data={this.state.selectedResponsibility || this.state.selectedNeed}
              onSelectDependency={this.onSelectDependency}
            />
          </Col>
        </Row>
        <Footer className="text-muted">
          <Col>
           A tool for tribal decentralised organisations.
          </Col>
        </Footer>
      </Container>
    );
  }
}

Home.defaultProps = {
  data: {
    needs: [],
  },
};

Home.propTypes = {
  data: PropTypes.shape({
    needs: PropTypes.array,
    refetch: PropTypes.func,
  }),
};

const NESTED_DATA_QUERY = gql`
  query Data {
    needs {
      nodeId
      title
      description
      guide {
        nodeId
        name
      }
      realizer {
        nodeId
        name
      }
      dependsOnNeeds {
        nodeId
        title
        description
      }
      dependsOnResponsibilites {
        nodeId
        title
        description
        guide {
          nodeId
          name
        }
        realizer {
          nodeId
          name
        }
        fulfills {
          nodeId
          title
        }
      }
      needsThatDependOnThis {
        nodeId
        title
        description
        guide {
          nodeId
          name
        }
        realizer {
          nodeId
          name
        }
      }
      responsibilitiesThatDependOnThis {
        nodeId
        title
        description
        guide {
          nodeId
          name
        }
        realizer {
          nodeId
          name
        }
        fulfills {
          nodeId
          title
        }
      }
      fulfilledBy {
        nodeId
        title
        description
        guide {
          nodeId
          name
        }
        realizer {
          nodeId
          name
        }
        fulfills {
          nodeId
          title
          description
          guide {
            nodeId
            name
          }
          realizer {
            nodeId
            name
          }
        }
        dependsOnNeeds {
          nodeId
          title
          description
          guide {
            nodeId
            name
          }
          realizer {
            nodeId
            name
          }
        }
        dependsOnResponsibilites {
          nodeId
          title
          description
          guide {
            nodeId
            name
          }
          realizer {
            nodeId
            name
          }
          fulfills {
            nodeId
            title
          }
        }
        needsThatDependOnThis {
          nodeId
          title
          description
          guide {
            nodeId
            name
          }
          realizer {
            nodeId
            name
          }
        }
        responsibilitiesThatDependOnThis {
          nodeId
          title
          description
          guide {
            nodeId
            name
          }
          realizer {
            nodeId
            name
          }
          fulfills {
            nodeId
            title
          }
        }
      }
    }
  }
`;

export default graphql(
  NESTED_DATA_QUERY,
  {
    name: 'data',
  },
)(Home);
