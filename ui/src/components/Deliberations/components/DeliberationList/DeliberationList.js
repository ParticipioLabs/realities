import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup, ListGroupItem } from 'reactstrap';
import TypeBadge from '@/components/TypeBadge';
import RemoveDeliberation from './components/RemoveDeliberation';

const StyledListGroup = styled(ListGroup)`
  margin-bottom: 2em;
`;

const StyledListGroupItem = styled(ListGroupItem)`
  position: relative;
  ${props => props.showremove && 'padding-right: 6em;'}
`;

const RemoveWrapper = styled.span`
  position: absolute;
  top: 0.54em;
  right: 0.54em;
`;

const AnchorUrl = styled.a`
  display: block;
  text-decoration: none;
  :hover { text-decoration: none; }
  :active { text-decoration: none; }
  :visited { text-decoration: none; }
`;

// <AnchorUrl href={url} key={nodeId} target="_blank">
// </AnchorUrl>

//

const Deliberations = ({ deliberations, showRemove }) => (
  <StyledListGroup>
    {deliberations.map(({
      node: {
        __typename,
        nodeId,
        title,
        url,
      },
    }) => (
      <StyledListGroupItem
        key={nodeId}
        href={url}
        tag="div"
        action
        showremove={showRemove ? 'true' : '' /* styled component doesn't want a boolean */}
      >
        <AnchorUrl href={url} target="_blank">
          <TypeBadge nodeType={__typename} />
          {title || url}
        </AnchorUrl>
        {showRemove && (
          <RemoveWrapper>
            <RemoveDeliberation nodeType={__typename} nodeId={nodeId} url={url} />
          </RemoveWrapper>
        )}

      </StyledListGroupItem>
    ))}
  </StyledListGroup>
);

Deliberations.propTypes = {
  deliberations: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    }),
    onClick: PropTypes.func,
  })),
  showRemove: PropTypes.bool,
};

Deliberations.defaultProps = {
  deliberations: [],
  showRemove: false,
};

export default Deliberations;
