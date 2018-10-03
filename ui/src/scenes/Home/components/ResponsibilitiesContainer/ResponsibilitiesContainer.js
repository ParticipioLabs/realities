import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { Query } from 'react-apollo';
import { GET_NEED_RESPONSIBILITIES } from '@/services/queries';
import withAuth from '@/components/withAuth';
import ListHeader from '@/components/ListHeader';
import colors from '@/styles/colors';
import WrappedLoader from '@/components/WrappedLoader';
import CreateResponsibility from './components/CreateResponsibility';
import ResponsibilitiesList from './components/ResponsibilitiesList';

const GET_SHOW_CREATE_RESPONSIBILITY = gql`
  query ResponsibilitiesContainer_showCreateResponsibility {
    showCreateResponsibility @client
  }
`;

const ResponsibilitiesContainer = withAuth(withRouter(({ auth, match }) => {
  if (!match.params.needId) return null;

  return (
    <Query query={GET_SHOW_CREATE_RESPONSIBILITY}>
      {({ data: localData, client }) => (
        <div>
          <ListHeader
            text="Responsibilities"
            color={colors.responsibility}
            showButton={auth.isLoggedIn && !!match.params.needId}
            onButtonClick={() => client.writeData({
              data: {
                showCreateResponsibility: !localData.showCreateResponsibility,
                showCreateNeed: false,
              },
            })}
          />
          <Collapse isOpen={localData.showCreateResponsibility}>
            <CreateResponsibility />
          </Collapse>
          <Query query={GET_NEED_RESPONSIBILITIES} variables={{ needId: match.params.needId }}>
            {({ loading, error, data }) => {
              if (loading) return <WrappedLoader />;
              if (error) return `Error! ${error.message}`;
              return (
                <ResponsibilitiesList
                  responsibilities={data.need.fulfilledBy}
                  selectedResponsibilityId={match.params.responsibilityId}
                />
              );
            }}
          </Query>
        </div>
      )}
    </Query>
  );
}));

ResponsibilitiesContainer.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
      resposibilityId: PropTypes.string,
    }),
  }),
};

ResponsibilitiesContainer.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
  match: {
    params: {
      needId: undefined,
      responsibilityId: undefined,
    },
  },
};

export default ResponsibilitiesContainer;
