import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import colors from '@/styles/colors';

const NeedsListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const NeedsListGroupItem = styled(ListGroupItem)`
  &:focus {
    outline: none;
  }
  &.active {
    background-color: ${colors.need};
    border-color: ${colors.need};
    color: white;
  }
`;

class NeedsList extends Component {
  componentDidMount() {
    this.props.subscribeToNeedsEvents();
  }

  render() {
    const { needs, selectedNeedId, history } = this.props;
    return (
      <div>
        <NeedsListGroup>
          {needs.map(need => (
            <NeedsListGroupItem
              key={need.nodeId}
              tag="button"
              href="#"
              action
              active={need.nodeId === selectedNeedId}
              onClick={() => history.push(`/${need.nodeId}`)}
            >
              {need.title}
            </NeedsListGroupItem>
          ))}
        </NeedsListGroup>
      </div>
    );
  }
}

NeedsList.propTypes = {
  subscribeToNeedsEvents: PropTypes.func.isRequired,
  needs: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  })),
  selectedNeedId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

NeedsList.defaultProps = {
  needs: [],
  selectedNeedId: undefined,
  history: {
    push: () => null,
  },
};

export default withRouter(NeedsList);
