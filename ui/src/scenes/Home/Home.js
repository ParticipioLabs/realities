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

import NeedsList from './components/NeedsList';
import ResponsibilitiesList from './components/ResponsibilitiesList';
import DetailView from './components/DetailView';

const SearchForm = styled(Form)`
  margin-bottom: 1em;
  font-size: large;
`;

class Home extends React.Component {
  constructor() {
    super();

    this.state = { selectedNeed: null, selectedResponsibility: null };
    this.onSelectNeed = this.onSelectNeed.bind(this);
    this.onSelectResponsibility = this.onSelectResponsibility.bind(this);
    this.onSelectDependency = this.onSelectDependency.bind(this);
  }

  onSelectNeed(need) {
    this.setState({ selectedNeed: need, selectedResponsibility: null });
  }

  onSelectResponsibility(responsibility) {
    this.setState({ selectedResponsibility: responsibility });
  }

  onSelectDependency(dependency) {
    let needs = this.props.data.needs;
    if(dependency.__typename === 'Responsibility') {
      try {
        let need = _.find(needs, function(o) { return o.nodeId === dependency.fulfills.nodeId})
        let responsibility = _.find(need.fulfilledBy, function(o) { return o.nodeId === dependency.nodeId});
        this.onSelectNeed(need);
        this.onSelectResponsibility(responsibility);
      }
      catch(err) {
        alert('Unfilfilled dependency?', err)
      }
      
    } else {
      let need = _.find(needs, function(o) { return o.nodeId === dependency.nodeId; });
      this.onSelectNeed(need);
    }
  }

  render() {
    const { needs } = this.props.data;
    return (
      <Container fluid>
        <Row>
          <Col sm={6}>
            <SearchForm>
              <Input
                bsSize='lg'
                placeholder={'Search for Need or Responsibility'}
                />
            </SearchForm>
            <Row>
              <Col sm={6}>
                <NeedsList
                  needs={needs}
                  onSelectNeed={this.onSelectNeed}
                  selectedNeed={this.state.selectedNeed}
                />
              </Col>
              <Col sm={6}>
                <ResponsibilitiesList
                  responsibilities={this.state.selectedNeed && this.state.selectedNeed.fulfilledBy}
                  onSelectResponsibility={this.onSelectResponsibility}
                  selectedResp={this.state.selectedResponsibility}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <DetailView 
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

export default graphql(gql`
  query {
    needs {
      nodeId
      title
      description
      guide { name }
      realizer { name }
      dependsOnNeeds {
        nodeId
        title
        description
      }
      dependsOnResponsibilites {
        nodeId
        title
        description
        guide { name }
        fulfills {
          nodeId
          title
        }
      }
      fulfilledBy {
        nodeId
        title
        description
        guide { name }
        realizer { name}
        dependsOnNeeds {
          nodeId
          title
          description
        }
        dependsOnResponsibilites {
          nodeId
          title
          description
          guide { name }
          fulfills {
            nodeId
            title
          }
        }
      }
    }
  }
`)(Home);
