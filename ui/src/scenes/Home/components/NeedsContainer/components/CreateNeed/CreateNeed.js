import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import ListForm from '@/components/ListForm';

const CREATE_NEED = gql`
  mutation CreateNeed_createNeedMutation($title: String!) {
    createNeed(title: $title) {
      nodeId
      title
    }
  }
`;

const CreateNeed = withRouter(({ history }) => (
  <Mutation
    mutation={CREATE_NEED}
    update={(cache) => {
      cache.writeData({ data: { showCreateNeed: false } });
   }}
  >
    {createNeed => (
      <Formik
        initialValues={{ title: '' }}
        validationSchema={yup.object().shape({
          title: yup.string().required('Title is required'),
        })}
        onSubmit={(values, { resetForm }) => {
          createNeed({ variables: { title: values.title } }).then(({ data }) => {
            resetForm();
            history.push(`/${data.createNeed.nodeId}`);
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
            placeholder="Enter a title for the new need..."
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

CreateNeed.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

CreateNeed.defaultProps = {
  history: {
    push: () => null,
  },
};

export default CreateNeed;
