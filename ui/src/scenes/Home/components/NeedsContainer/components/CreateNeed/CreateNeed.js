import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';
import { Mutation } from '@apollo/client/react/components';
import { Formik } from 'formik';
import { GET_NEEDS, SET_CACHE } from '@/services/queries';
import ListForm from '@/components/ListForm';

const CREATE_NEED = gql`
  mutation CreateNeed_createNeedMutation($title: String!) {
    createNeed(title: $title) {
      nodeId
      title
      fulfilledBy {
        nodeId
        title
        realizer {
          nodeId
          name
        }
      }
    }
  }
`;

const CreateNeed = withRouter(({ history }) => (
  <Mutation
    mutation={CREATE_NEED}
    update={(cache, { data: { createNeed } }) => {
      cache.writeQuery({
        query: SET_CACHE,
        data: {
          showCreateNeed: false,
        },
      });
      const { needs } = cache.readQuery({ query: GET_NEEDS });

      const alreadyExists = needs.filter(need => need.nodeId === createNeed.nodeId).length > 0;
      if (!alreadyExists) {
        cache.writeQuery({
          query: GET_NEEDS,
          data: { needs: [createNeed, ...needs] },
        });
      }
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
