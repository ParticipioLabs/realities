import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RIEInput, RIETextArea } from 'riek';
import _ from 'lodash';
import graphUtils from '@/services/graphUtils';

import { Badge, Card, CardImg, CardText, CardBody, CardBlock,
  CardTitle, CardSubtitle, Form, FormGroup, Label, Input, FormText, Row, Col, Button } from 'reactstrap';

import DependencyList from '../DependencyList';

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

const RealitiesInput = styled(Input)`
    padding-bottom: 0;
    border: none;
    border-bottom: 1px dotted #85bcf7;
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
  state = { data: undefined }
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.data) {
      const { data } = nextProps;
      this.setState({ data });
    }
  }

  // Validate length of strings for title, guide nane, realizer name
  isStringAcceptable = string => _.isString && string.length >= 1 && string.length <= 100;

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <Card>
          <CardBody>
            <BadgeLabel color={data && data.__typename === 'Responsibility' ? '#843cfd' : '#00cf19'}>{data && data.__typename}</BadgeLabel>
            <Title>
              <RIEInput
                value={data.title}
                change={data => this.setState({ data: { title: data.title } })}
                propName="title"
                validate={this.isStringAcceptable}
              />
            </Title>            
            <InputDiv><LabelSpan>Guide:</LabelSpan>
              <Underlined>
                {data.guide ? <RIEInput
                  value={data.guide.name}
                  change={data => this.setState({ data: { guideName: data.guide.name } })}
                  propName="guideName"
                  validate={this.isStringAcceptable}
                /> : <div /> }
              </Underlined>
            </InputDiv>

            <InputDiv><LabelSpan>Realizer:</LabelSpan>
              <Underlined>
                {data.realizer ? <RIEInput
                  value={data.realizer.name}
                  change={data => this.setState({ data: { realizerName: data.realizer.name } })}
                  propName="realizerName"
                  validate={this.isStringAcceptable}
                /> : <div /> }
              </Underlined>
            </InputDiv>

            <DescriptionDiv>
              <div><LabelSpan>Description:</LabelSpan></div>
              {data.description ? <RIETextArea
                value={data.description}
                change={data => this.setState({ data: { description: data.description } })}
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
                  change={data => this.setState({ data: { deliberationUrl: data.deliberation.url } })}
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
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <div style={{ height: '20em' }}>
                        <LocalGraph 
                          graph={graphUtils.getSubGraph(data)}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </InputDiv>

          </CardBody>
        </Card>

      );
    }
    return <div />;
  }
}
/*
const DetailView = ({ data }) => {
  console.log(data);
  return (
    <Card>
      <CardBody>
        <CardTitle><BadgeLabel color={data && data.__typename === 'Responsibility' ? '#843cfd' : '#00cf19'}>{data && data.__typename}</BadgeLabel> {data && data.title} </CardTitle>
          <Form>
            <FormGroup row>
              <Label for="guideName" sm={3}>Guide</Label>
              <Col sm={9}>
                <RealitiesInput type="text" name="guide" id="guideName" placeholder={data && data.guide.name} />
              </Col>
            </FormGroup>
            <FormGroup row>
             <Label for="realizerName" sm={3}>Realizer</Label>
              <Col sm={9}>
                <RealitiesInput type="text" name="realizer" id="realizerName" placeholder={data && data.realizer.name} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="descriptionName" sm={4}>Description</Label>
              <Col sm={12}>
                <FormText name="description" id="descriptionName">
                 {data && data.description}
                 </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
             <Label for="deliberationName" sm={4}>Deliberation</Label>
              <Col sm={8}>
                <RealitiesInput type="text" name="deliberation" id="deliberationName" placeholder={data && data.deliberation} />
              </Col>
            </FormGroup>
          </Form>

      <Card>
        <CardBody>
             <Row>
               <Col>
                 <DependencyList
                  dependsOnNeeds={this.dependsOnNeeds}
                  dependsOnResponsibilities={this.dependsOnResponsibilities}
                />
               </Col>
              </Row>
        </CardBody>
      </Card>
    </CardBody>
  </Card>
  );
};
*/

DetailView.defaultProps = {
  data: { title: '', description: '' },
};

DetailView.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default DetailView;
