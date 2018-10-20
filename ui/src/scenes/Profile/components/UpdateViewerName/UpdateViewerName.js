import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { Query, Mutation } from 'react-apollo';
import { Formik } from 'formik';
import history from '@/services/history';
import withAuth from '@/components/withAuth';
import WrappedLoader from '@/components/WrappedLoader';
import UpdateViewerNameForm from './components/UpdateViewerNameForm';

const GET_VIEWER_NAME = gql`
  query UpdateViewerName_person($email: String!) {
    person(email: $email) {
      nodeId
      name
    }
  }
`;

const UPDATE_VIEWER_NAME = gql`
  mutation UpdateViewerName_updateViewerNameMutation($name: String!) {
    updateViewerName(name: $name) {
      nodeId
      name
    }
  }
`;

const UpdateViewerName = withAuth(({ auth }) => (
  <Query
    query={GET_VIEWER_NAME}
    variables={{ email: auth.email }}
  >
    {({
      loading,
      error,
      data,
      refetch,
    }) => {
      if (loading) return <WrappedLoader />;
      if (error) return `Error! ${error.message}`;
      const viewer = data.person || {};
      return (
        <Mutation mutation={UPDATE_VIEWER_NAME}>
          {updateViewerName => (
            <Formik
              initialValues={{ name: viewer.name || '' }}
              validationSchema={yup.object().shape({
                name: yup.string().required('Name is required'),
              })}
              onSubmit={(values) => {
                updateViewerName({ variables: { name: values.name } })
                  .then(() => {
                    refetch().then(() => history.push('/'));
                  });
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <UpdateViewerNameForm
                  inputName="name"
                  placeholder="Your name..."
                  value={values.name}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </Formik>
          )}
        </Mutation>
      );
    }}
  </Query>
));

UpdateViewerName.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string,
  }),
};

UpdateViewerName.defaultProps = {
  auth: {
    email: '',
  },
};

export default UpdateViewerName;
