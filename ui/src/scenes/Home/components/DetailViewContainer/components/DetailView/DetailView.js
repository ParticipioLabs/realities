import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import graphUtils from '@/services/graphUtils';
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
import DependencyList from './components/DependencyList';
import LocalGraph from './components/LocalGraph';

const DetailViewCardHeader = styled(CardHeader)`
  background-color: ${props => props.color};
  color: white;
`;

const LabelSpan = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const DetailView = ({ node }) => (
  <Card>
    <DetailViewCardHeader color={node.__typename === 'Responsibility' ? '#843cfd' : '#00cf19'}>
      {node.__typename}
    </DetailViewCardHeader>
    <CardBody>
      <CardTitle>
        {node.title}
      </CardTitle>

      <CardText>
        <LabelSpan>
          Guide:
        </LabelSpan>
        {node.guide && (
          node.guide.name
            ? `${node.guide.name} (${node.guide.email})`
            : node.guide.email
        )}
      </CardText>

      <CardText>
        <LabelSpan>
          Realizer:
        </LabelSpan>
        {node.realizer && (
          node.realizer.name
            ? `${node.realizer.name} (${node.realizer.email})`
            : node.realizer.email
        )}
      </CardText>

      <CardText>
        <LabelSpan>
          Description:
        </LabelSpan>
        {node.description}
      </CardText>

      <CardText>
        <LabelSpan>Deliberation:</LabelSpan>
        <a href={node.deliberationLink} target="_blank">{node.deliberationLink}</a>
      </CardText>

      <CardText tag="div">
        <LabelSpan>Depends on:</LabelSpan>
        <DependencyList
          dependencies={[
            ...(node.dependsOnNeeds || []),
            ...(node.dependsOnResponsibilities || []),
          ]}
        />
      </CardText>

      {/*<CardText>
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
      </CardText>*/}

      {/*<CardText>
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
      </CardText>*/}
    </CardBody>
  </Card>
);

DetailView.propTypes = {
  node: PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    deliberationLink: PropTypes.string,
    guide: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    realizer: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    dependsOnNeeds: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    })),
    dependsOnResponsibilities: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
      fulfills: PropTypes.shape({
        nodeId: PropTypes.string,
      }),
    })),
  }),
};

DetailView.defaultProps = {
  node: {
    nodeId: '',
    title: '',
    description: '',
    deliberationLink: '',
    guide: {
      nodeId: '',
      email: '',
      name: '',
    },
    realizer: {
      nodeId: '',
      email: '',
      name: '',
    },
    dependsOnNeeds: [],
    dependsOnResponsibilities: [],
  },
};

export default DetailView;
