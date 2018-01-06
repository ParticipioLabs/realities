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
import Search from './components/Search';

// const SearchForm = styled(Search)`
//  margin-bottom: 1em;
//  font-size: large;
// `;



class Home extends React.Component {
  constructor() {
    super();

    console.log(this);

    this.state = {
      selectedNeed: null,
      selectedResponsibility: null,
      newNeed: false,
      searchMenuIsOpen: false,
    };
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

  toggleCreateNewNeed() {
    this.setState({ newNeed: !this.state.newNeed });
  }

  createNewResponsibility() {
    this.setState({});

    // this.setState({ newResponsibility: true });
  }

  //handleChange = (selectedItem) => {
  //  console.log('Got change', selectedItem);
  //  if (selectedItem.__typename === 'Need') {
  //    this.onSelectNeed(selectedItem);
  //  } else if (selectedItem.__typename === 'Responsibility') {
  //    this.onSelectResponsibility(selectedItem);
  //  }
  //}
  //
  //handleStateChange = (changes, downshiftState) => {
  //  if (changes.hasOwnProperty('isOpen')) {
  //    // downshift is saying that isOpen should change, so let's change it...
  //    this.setState(({ isOpen, itemsToShow }) => {
  //      // if it's changing because the user's clicking outside of the downshift
  //      // component, then we actually don't want to change the isOpen state
  //      isOpen =
  //        changes.type === Downshift.stateChangeTypes.mouseUp
  //          ? isOpen
  //          : changes.isOpen;
  //      if (isOpen) {
  //        // if the menu is going to be open, then we should limit the results
  //        // by what the user has typed in, otherwise, we'll leave them as they
  //        // were last...
  //        itemsToShow = this.getItemsToShow(downshiftState.inputValue);
  //      }
  //
  //      return { isOpen, itemsToShow };
  //    });
  //  } else if (changes.hasOwnProperty('inputValue')) {
  //    // downshift is saying that the inputValue is changing. Since we don't
  //    // control that, we'll just use that information to update the items
  //    // that we should show.
  //    this.setState({
  //      itemsToShow: this.getItemsToShow(downshiftState.inputValue),
  //    });
  //  }
  //};

  render() {
    const { newNeed } = this.state;
    var { needs } = this.props.data;
    console.log('home props', this.props);
    console.log('home needs', needs);

    const sortedNeeds = needs && needs.slice().sort((a, b) =>  {
      console.log(a, b);
      var nameA = a.title.toLowerCase();
      var nameB = b.title.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });

    return (
      <Container fluid>
        <Row>
          <Col lg={6} xs={12}>
            <Search
              items={ _.concat(needs) }
              onSelectNeed={this.onSelectNeed}
              onSelectResponsibility={this.onSelectResponsibility}
            />
            <Row>
              <Col>
                <CreateNeed
                  newNeed={newNeed}
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
