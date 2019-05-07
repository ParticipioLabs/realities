import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import colors from '@/styles/colors';
import RealizersMissingIcon from '@/components/RealizersMissingIcon';
import _ from 'lodash';

const ResponsibilitiesListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const ResponsibilitiesListGroupItem = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: ${colors.responsibility};
    border-color: ${colors.responsibility};
    color: white;
  }
`;

const renderMissingRealizerIcon = (responsibility) => {
  if (!responsibility.realizer) {
    return <RealizersMissingIcon />;
  }
  return '';
};
class ResponsibilitiesList extends Component {
  componentDidMount() {
    this.props.subscribeToResponsibilitiesEvents();
  }

  render() {
    const {
      selectedResponsibilityId,
      history,
      match,
    } = this.props;
    const responsibilitiesAlphabetical = _.orderBy(this.props.responsibilities, [(r) => {
      if (r.title) return r.title.toLowerCase();
      return '';
    }], ['asc']);
    const responsibilities = _.orderBy(responsibilitiesAlphabetical, [r =>
      (r.nodeId === selectedResponsibilityId),
    ], ['desc']);
    return (
      <div>
        <ResponsibilitiesListGroup>
          {responsibilities.map(responsibility => (
            <ResponsibilitiesListGroupItem
              key={responsibility.nodeId}
              tag="button"
              href="#"
              action
              active={responsibility.nodeId === selectedResponsibilityId}
              onClick={() => history.push(`/${match.params.needId}/${responsibility.nodeId}`)}
            >
              {responsibility.title}
              {renderMissingRealizerIcon(responsibility)}
            </ResponsibilitiesListGroupItem>
          ))}
        </ResponsibilitiesListGroup>
      </div>
    );
  }
}

ResponsibilitiesList.propTypes = {
  subscribeToResponsibilitiesEvents: PropTypes.func.isRequired,
  responsibilities: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  })),
  selectedResponsibilityId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
    }),
  }),
};

ResponsibilitiesList.defaultProps = {
  responsibilities: [],
  selectedResponsibilityId: undefined,
  history: {
    push: () => null,
  },
  match: {
    params: {
      needId: undefined,
    },
  },
};

export default withRouter(ResponsibilitiesList);
