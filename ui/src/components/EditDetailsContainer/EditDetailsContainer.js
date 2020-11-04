import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { Formik } from 'formik';
import { SET_CACHE } from 'services/queries';
import EditDetailsForm from './components/EditDetailsForm';

const createEditDetailsMutation = nodeType => gql`
  mutation EditDetailsContainer_update${nodeType}(
    $nodeId: ID!
    $title: String!
    $guideEmail: String!
    $realizerEmail: String
    $description: String
    $deliberationLink: String
  ) {
    update${nodeType}(
      nodeId: $nodeId
      title: $title
      guideEmail: $guideEmail
      realizerEmail: $realizerEmail
      description: $description
      deliberationLink: $deliberationLink
    ) {
      nodeId
      title
      description
      deliberationLink
      guide {
        nodeId
        email
        name
      }
      realizer {
        nodeId
        email
        name
      }
    }
  }
`;

const EditDetailsContainer = ({ node }) => {
  const [updateNode, { client }] = useMutation(createEditDetailsMutation(node.__typename));

  return (
    <Formik
      initialValues={{
        title: node.title || '',
        guide: node.guide || null,
        realizer: node.realizer || null,
        description: node.description || '',
        deliberationLink: node.deliberationLink || '',
      }}
      enableReinitialize
      validationSchema={yup.object().shape({
        title: yup.string().required('Title is required'),
        guide: yup.object().shape({
          email: yup.string().required(),
        }).typeError('Guide is required').required(),
        realizer: yup.object().shape({
          email: yup.string(),
        }).nullable(),
        description: yup.string().nullable(),
        deliberationLink: yup.string().nullable(),
      })}
      onSubmit={(values, { resetForm }) => {
        updateNode({
          variables: {
            nodeId: node.nodeId,
            title: values.title,
            guideEmail: values.guide && values.guide.email,
            realizerEmail: values.realizer && values.realizer.email,
            description: values.description,
            deliberationLink: values.deliberationLink,
          },
        }).then(() => {
          resetForm();
          client.writeQuery({
            query: SET_CACHE,
            data: {
              showDetailedEditView: false,
            },
          });
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
        setFieldValue,
        isSubmitting,
      }) => (
          <EditDetailsForm
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            cancel={() => client.writeQuery({
              query: SET_CACHE,
              data: {
                showDetailedEditView: false,
              },
            })}
          />
        )}
    </Formik>
  );
};

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
