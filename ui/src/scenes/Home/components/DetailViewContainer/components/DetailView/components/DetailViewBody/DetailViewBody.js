import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
} from 'reactstrap';
import Dependencies from '@/components/Dependencies';
import RealizersMissingIcon from '@/components/RealizersMissingIcon';
import Deliberations from '@/components/Deliberations';


const LabelSpan = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const CardSection = styled.div`
  margin-bottom: 1rem;
`;

const DetailViewBody = ({ node }) => (
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
      {!node.realizer && <RealizersMissingIcon />}
    </CardText>

    <CardText>
      <LabelSpan>
        Description:
      </LabelSpan>
      {node.description}
    </CardText>

    <CardSection>
      <LabelSpan>Deliberations:</LabelSpan>
      <Deliberations
        nodeType={node.__typename}
        nodeId={node.nodeId}
        deliberations={[
          ...(node.deliberations || []),
        ]}
      />
    </CardSection>

    <CardSection>
      <LabelSpan>Depends on:</LabelSpan>
      <Dependencies
        nodeType={node.__typename}
        nodeId={node.nodeId}
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
);

DetailViewBody.propTypes = {
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
    hasDeliberations: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string,
    })),
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

DetailViewBody.defaultProps = {
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
    hasDeliberations: [],
    dependsOnNeeds: [],
    dependsOnResponsibilities: [],
  },
};

export default DetailViewBody;
