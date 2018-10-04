import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import { GET_NEED_RESPONSIBILITIES } from '@/services/queries';
import ListForm from '@/components/ListForm';

const CREATE_RESPONSIBILITY = gql`
  mutation CreateResponsibility_createResponsibilityMutation($title: String!, $needId: ID!) {
    createResponsibility(title: $title, needId: $needId) {
      nodeId
      title
    }
  }
`;

const CreateResponsibility = withRouter(({ match, history }) => (
  <Mutation
    mutation={CREATE_RESPONSIBILITY}
    update={(cache, { data: { createResponsibility } }) => {
      cache.writeData({ data: { showCreateResponsibility: false } });
      const { need } = cache.readQuery({
        query: GET_NEED_RESPONSIBILITIES,
        variables: { needId: match.params.needId },
      });
      cache.writeQuery({
        query: GET_NEED_RESPONSIBILITIES,
        variables: { needId: match.params.needId },
        data: {
          need: {
            __typename: 'Need',
            nodeId: match.params.needId,
            fulfilledBy: need.fulfilledBy
              ? [createResponsibility].concat(need.fulfilledBy)
              : [createResponsibility],
          },
        },
      });
    }}
  >
    {createResponsibility => (
      <Formik
        initialValues={{ title: '' }}
        validationSchema={yup.object().shape({
          title: yup.string().required('Title is required'),
        })}
        onSubmit={(values, { resetForm }) => {
          createResponsibility({
            variables: {
              title: values.title,
              needId: match.params.needId,
            },
          }).then(({ data }) => {
            resetForm();
            history.push(`/${match.params.needId}/${data.createResponsibility.nodeId}`);
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
          <ListForm
            inputName="title"
            placeholder="Enter a title for the new responsibility..."
            value={values.title}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Formik>
    )}
  </Mutation>
));

CreateResponsibility.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

CreateResponsibility.defaultProps = {
  match: {
    params: {
      needId: undefined,
    },
  },
  history: {
    push: () => null,
  },
};

export default CreateResponsibility;
