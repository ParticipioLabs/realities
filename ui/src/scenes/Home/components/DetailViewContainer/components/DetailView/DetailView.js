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
import { FaPencil } from 'react-icons/lib/fa';
import colors from '@/styles/colors';
import IconButton from '@/components/IconButton';
import DependencyList from './components/DependencyList';
import LocalGraph from './components/LocalGraph';

const DetailViewCardHeader = styled(CardHeader)`
  background-color: ${props => props.color};
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 0.7rem 0.5rem 1.25rem;
`;

const HeaderText = styled.span`
  line-height: 2.125rem;
`;

const HeaderButton = styled(IconButton)`
  font-size: 1.25rem;
  padding: 0 0.4rem 0.2rem 0.4rem;
`;

const LabelSpan = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const CardSection = styled.div`
  margin-bottom: 1rem;
`;

const DetailView = ({ node, onClickEdit }) => (
  <Card>
    <DetailViewCardHeader
      color={node.__typename === 'Responsibility' ? colors.responsibility : colors.need}
    >
      <HeaderText>
        {node.__typename}
      </HeaderText>
      <HeaderButton onClick={onClickEdit}>
        <FaPencil />
      </HeaderButton>
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
  onClickEdit: PropTypes.func,
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
  onClickEdit: () => null,
};

export default DetailView;
