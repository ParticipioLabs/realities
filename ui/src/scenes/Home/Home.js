import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import _ from 'lodash';
import CreateNeed from './components/CreateNeed';
import NeedsList from './components/NeedsList';
import ResponsibilitiesList from './components/ResponsibilitiesList';
import DetailView from './components/DetailView';
import Search from './components/Search';

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedNeed: null,
      selectedResponsibility: null,
      newNeed: false,
    };
    this.refetchData = this.refetchData.bind(this);
    this.onSelectNeed = this.onSelectNeed.bind(this);
    this.toggleCreateNewNeed = this.toggleCreateNewNeed.bind(this);
    this.onSelectResponsibility = this.onSelectResponsibility.bind(this);
    this.onSelectDependency = this.onSelectDependency.bind(this);
    this.getResponsibilities = this.getResponsibilities.bind(this);
    this.getPeople = this.getPeople.bind(this);
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

  getResponsibilities() {
    const { needs } = this.props.data;
    return needs ? _.flatten(needs.map(need => need.fulfilledBy)) : [];
  }

  getPeople() {
    // This returns duplicates due to differing values for each Person object.
    const { needs } = this.props.data;
    return needs ? new Set(_.concat(
      _.flatten(needs.map(need => need.guide)),
      _.flatten(needs.map(need => need.realizer)),
    ).filter(item => item)) : [];
  }

  async refetchData() {
    // If node has changed this must go to state, reselecting after refetch
    const { selectedNeed, selectedResponsibility } = this.state;
    await this.props.data.refetch();
    const { needs } = this.props.data;
    const need = (selectedNeed
      ? _.find(needs, o => o.nodeId === selectedNeed.nodeId)
      : selectedNeed);
    const resp = (selectedResponsibility
      ? _.find(need.fulfilledBy, o => o.nodeId === selectedResponsibility.nodeId)
      : selectedResponsibility);
    this.setState({ selectedNeed: need, selectedResponsibility: resp });
  }

  toggleCreateNewNeed(newNeed) {
    if (newNeed) {
      const { nodeId } = newNeed;
      const awaitNewNeeds = async () => {
        try {
          await this.refetchData();
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
    const responsibilities = this.getResponsibilities();
    const people = this.getPeople();
    console.log('people', people);
    const searchItems = _.concat(needs, responsibilities);

    return (
      <Container fluid>
        <Row>
          <Col lg={6} xs={12}>
            <Search
              items={searchItems}
              onSelectDependency={this.onSelectDependency}
            />
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
              refetchData={this.refetchData}
            />
          </Col>
        </Row>
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
