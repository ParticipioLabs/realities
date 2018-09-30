import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
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

const CardSection = styled.div`
  margin-bottom: 1rem;
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

      <CardSection>
        <LabelSpan>Depends on:</LabelSpan>
        <DependencyList
          dependencies={[
            ...(node.dependsOnNeeds || []),
            ...(node.dependsOnResponsibilities || []),
          ]}
        />
      </CardSection>

      <CardSection>
        <LabelSpan>Graph:</LabelSpan>
        <Card>
          <LocalGraph nodeType={node.__typename} nodeId={node.nodeId} />
        </Card>
      </CardSection>
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
