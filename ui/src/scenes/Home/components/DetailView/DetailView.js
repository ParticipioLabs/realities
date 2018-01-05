import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RIEInput, RIETextArea } from 'riek';
import _ from 'lodash';
import graphUtils from '@/services/graphUtils';
import { Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Popover,
  PopoverHeader,
  PopoverBody } from 'reactstrap';
import DependencyList from './DependencyList';

import LocalGraph from '../LocalGraph';

const InputDiv = styled.div`
  margin: 1.0em 0 1.0em 0;
`;

const LabelSpan = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const BadgeLabel = styled.span`
  border-radius: 4px;
  background-color: ${props => props.color};
  padding: 5px;
  display: inline-block;
  color: white;
  float: right;
`;

const Underlined = styled.div`
  border-bottom: 1px dotted;
  display: inline-block;
`;

const Title = styled(CardTitle)`
  border-bottom: 1px dotted;
  display: inline-block;
`;

const DescriptionDiv = styled.div`
  border: none;
  padding-left: 0;
  margin-bottom: 1em;
`;

class DetailView extends Component {
  state = { data: undefined, selectedGraphNode: {} };
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.data) {
      const { data } = nextProps;
      const selectedGraphNode = {};
      const popoverOpen = false;
      this.setState({ data, selectedGraphNode, popoverOpen });
    }
  }

  // Validate length of strings for title, guide name, realizer name
  isStringAcceptable = string => _.isString && string.length >= 1 && string.length <= 100;

  // Handle the select event on the graph.
  // Repeating the call to graphUtils.getSubGraph() seems wasteful,
  // since it has already been called, and won't have changed.
  graphEvents = {
    select: (event) => {
      const { nodes } = event;
      const node = _.toString(nodes[0]);
      const graph = graphUtils.getSubGraph(this.state.data);
      const graphNode = _.find(graph.nodes, { id: node });
      if (graphNode) {
        this.setState({ selectedGraphNode: graphNode, popoverOpen: true });
      } else {
        this.setState({ selectedGraphNode: {}, popoverOpen: false });
      }
    },
  };

  toggle = () => {
    this.setState({
      popoverOpen: true,
    });
  };

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <Card>
          <CardBody>
            <BadgeLabel
              color={data && data.__typename === 'Responsibility' ? '#843cfd' : '#00cf19'}
            >
              {data && data.__typename}
            </BadgeLabel>
            <Title>
              <RIEInput
                value={data.title}
                change={() => this.setState({ data: { title: data.title } })}
                propName="title"
                validate={this.isStringAcceptable}
              />
            </Title>
            <InputDiv><LabelSpan>Guide:</LabelSpan>
              <Underlined>
                {data.guide ? <RIEInput
                  value={data.guide.name}
                  change={() => this.setState({ data: { guideName: data.guide.name } })}
                  propName="guideName"
                  validate={this.isStringAcceptable}
                /> : <div /> }
              </Underlined>
            </InputDiv>

            <InputDiv><LabelSpan>Realizer:</LabelSpan>
              <Underlined>
                {data.realizer ? <RIEInput
                  value={data.realizer.name}
                  change={() => this.setState({ data: { realizerName: data.realizer.name } })}
                  propName="realizerName"
                  validate={this.isStringAcceptable}
                /> : <div /> }
              </Underlined>
            </InputDiv>

            <DescriptionDiv>
              <div><LabelSpan>Description:</LabelSpan></div>
              {data.description ? <RIETextArea
                value={data.description}
                change={() => this.setState({ data: { description: data.description } })}
                propName="description"
                classEditing="form-control"
                validate={_.isString}
              /> : <div /> }
            </DescriptionDiv>

            <InputDiv>
              <LabelSpan>Deliberation:</LabelSpan>
              <Underlined>
                {data.deliberationion ? <RIEInput
                  value={data.deliberation.url}
                  change={() => this.setState({ data: { deliberationUrl: data.deliberation.url } })}
                  propName="deliberationUrl"
                  validate={this.isStringAcceptable}
                /> : <div /> }
              </Underlined>
            </InputDiv>

            <InputDiv>
              <LabelSpan>Dependencies:</LabelSpan>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <DependencyList
                        dependsOnNeeds={data.dependsOnNeeds}
                        dependsOnResponsibilities={data.dependsOnResponsibilites}
                        onSelectDependency={this.props.onSelectDependency}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </InputDiv>

            <InputDiv>
              <LabelSpan>Graph:</LabelSpan>
              <Card id="graphCard">
                <CardBody>
                  <Row>
                    <Col>
                      <div style={{ height: '20em' }}>
                        <LocalGraph
                          graph={graphUtils.getSubGraph(data)}
                          events={this.graphEvents}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </InputDiv>

            <InputDiv>
              <Popover
                placement="left-start"
                isOpen={this.state.popoverOpen}
                target="graphCard"
                toggle={this.toggle}
              >
                <PopoverHeader>{this.state.selectedGraphNode.title}</PopoverHeader>
                <PopoverBody>
                  {_.truncate(
                    this.state.selectedGraphNode.description,
                    { length: 512, separator: ',.?! ' },
                  ) }
                </PopoverBody>
              </Popover>
            </InputDiv>
          </CardBody>
        </Card>
      );
    }

    return <div />;
  }
}

DetailView.defaultProps = {
  data: { title: '', description: '' },
  onSelectDependency: PropTypes.func.isRequired,
};

DetailView.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  onSelectDependency: PropTypes.func,
};

export default DetailView;
