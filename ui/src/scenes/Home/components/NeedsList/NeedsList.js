import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import styled from 'styled-components';

const ListDiv = styled.div`
  .list-heading {
    color: green;
  }
  .list-area {
    border: 1px solid red;
  }
`;

const List = styled(ListGroup)`
  color: red;
`;

const RealitiesListHeader = styled.p`
      font-size: 1.5em;
      padding: .5em 0 .5em 0;
      color: #fff;
      text-align:center;
      background-color: #00cf19;
`;
const RealitiesListGroupItem = styled(ListGroupItem)`
  .active {
    background-color: #fff;
    color: #fff;
    }
`
const NeedsList = ({ needs, onSelectNeed, selectedNeed }) => (
  <div>
    <RealitiesListHeader>Needs</RealitiesListHeader>
    <ListGroup>
      {needs && needs.map((need, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <RealitiesListGroupItem
          key={i}
          className={need === selectedNeed && "active"}
          onClick={() => onSelectNeed(need)}>
          {need.title}
        </RealitiesListGroupItem>
      ))}
    </ListGroup>
  </div>
);

NeedsList.defaultProps = {
  needs: [],
};

NeedsList.propTypes = {
  needs: PropTypes.array,
  onSelectNeed: PropTypes.func.isRequired,
};

export default NeedsList;
