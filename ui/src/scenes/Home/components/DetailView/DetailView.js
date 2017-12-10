import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RIEInput, RIETextArea } from 'riek';
import _ from 'lodash';

import { Badge, Card, CardImg, CardText, CardBody, CardBlock,
  CardTitle, CardSubtitle, Form, FormGroup, Label, Input, FormText, Row, Col, Button  } from 'reactstrap';

import DependencyList from '../DependencyList';


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
`

const Underlined = styled.div`
  border-bottom: 1px dotted;
  display: inline-block;
`;

const Title = styled(CardTitle)`
  border-bottom: 1px dotted;
  display: inline-block;
`;

const Description = styled(CardText)`
  width: 100%;
`;


class DetailView extends Component {
  state = { data: undefined }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.data) {
      const { data } = nextProps;
      this.setState({ data });
    }
  }

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <Card>
          <CardBody>
          <BadgeLabel color={data && data.__typename === 'Responsibility' ? '#843cfd' : '#00cf19'}>{data && data.__typename}</BadgeLabel> 
            <Title><RIEInput
              value={data.title}
              change={data => this.setState({ data: { title: data.title } })}
              propName="title"
              validate={_.isString}
            />
            </Title>
            <br />

 			<Underlined>
            <RIEInput
              value={data.guide && data.guide.name}
              change={data => this.setState({ data: { guideName: data.guide.name } })}
              propName="guideName"
              validate={_.isString}
            />
            </Underlined>
            <br />
    
            <Underlined>
            <RIEInput
              value={data.realizer && data.realizer.name}
              change={data => this.setState({ data: { realizerame: data.realizer.name } })}
              propName="realizerName"
              validate={_.isString}
            />
            </Underlined>
            <br />

            
            
            <Description>
              {data.description ? <RIETextArea
                value={data.description}
                change={data => this.setState({ data: { description: data.description } })}
                propName="description"
                validate={_.isString}
              /> : <div /> }
            </Description>

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
