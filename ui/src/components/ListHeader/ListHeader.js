import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card } from 'reactstrap';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { CACHE_QUERY } from 'services/queries';

// background-color: ${(props) => props.color || '#999'};
const StyledHeader = styled(Card)`
  color: white;
  flex-direction: row;
  font-size: 1.25rem;
  justify-content: end;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
`;

const AddButton = styled(Button)`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-column-gap: 0.3rem;
  margin-left: 0.5rem;
`;

const ListHeaderText = styled.span`
  line-height: 2.1rem;
`;

const ListHeader = () => {
  const params = useParams();
  const { data: localData = {}, client } = useQuery(CACHE_QUERY);

  return (
    <StyledHeader>
      <AddButton
        onClick={() => client.writeQuery({
          query: CACHE_QUERY,
          data: {
            showCreateNeed: !localData.showCreateNeed,
            showCreateResponsibility: false,
          },
        })}
        color="need"
        data-cy="list-header-plus-btn"
      >
        <ListHeaderText>
          Need
        </ListHeaderText>
        <FaPlus />
      </AddButton>
      {!!params.needId && (
      <AddButton
        onClick={() => client.writeQuery({
          query: CACHE_QUERY,
          data: {
            showCreateResponsibility: !localData.showCreateResponsibility,
            showCreateNeed: false,
          },
        })}
        color="responsibility"
        data-cy="list-header-plus-btn"
      >
        <ListHeaderText>
          Responsibility
        </ListHeaderText>
        <FaPlus />
      </AddButton>
      )}
    </StyledHeader>
  );
};

export default ListHeader;
