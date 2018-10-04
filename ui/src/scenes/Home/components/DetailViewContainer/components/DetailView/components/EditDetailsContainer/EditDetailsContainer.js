import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import EditDetailsForm from './components/EditDetailsForm';

const createEditDetailsMutation = nodeType => gql`
  mutation EditDetailsContainer_update${nodeType}(
    $nodeId: ID!
    $title: String!
    $description: String
    $deliberationLink: String
  ) {
    update${nodeType}(
      nodeId: $nodeId
      title: $title
      description: $description
      deliberationLink: $deliberationLink
    ) {
      nodeId
      title
      description
      deliberationLink
    }
  }
`;

const EditDetailsContainer = ({ node }) => (
  <Mutation mutation={createEditDetailsMutation(node.__typename)}>
    {(updateNode, { client }) => (
      <Formik
        initialValues={{
          title: node.title,
          description: node.description,
          deliberationLink: node.deliberationLink,
        }}
        validationSchema={yup.object().shape({
          title: yup.string().required('Title is required'),
          description: yup.string(),
          deliberationLink: yup.string(),
        })}
        onSubmit={(values, { resetForm }) => {
          updateNode({
            variables: {
              nodeId: node.nodeId,
              title: values.title,
              description: values.description,
              deliberationLink: values.deliberationLink,
            },
          }).then(() => {
            resetForm();
            client.writeData({ data: { showDetailedEditView: false } });
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <EditDetailsForm
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            cancel={() => client.writeData({ data: { showDetailedEditView: false } })}
          />
        )}
      </Formik>
    )}
  </Mutation>
);

EditDetailsContainer.propTypes = {
  node: PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    deliberationLink: PropTypes.string,
    guide: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    realizer: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    dependsOnNeeds: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    })),
    dependsOnResponsibilities: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
      fulfills: PropTypes.shape({
        nodeId: PropTypes.string,
      }),
    })),
  }),
};

EditDetailsContainer.defaultProps = {
  node: {
    nodeId: '',
    title: '',
    description: '',
    deliberationLink: '',
    guide: {
      nodeId: '',
      email: '',
      name: '',
    },
    realizer: {
      nodeId: '',
      email: '',
      name: '',
    },
    dependsOnNeeds: [],
    dependsOnResponsibilities: [],
  },
};

export default EditDetailsContainer;
