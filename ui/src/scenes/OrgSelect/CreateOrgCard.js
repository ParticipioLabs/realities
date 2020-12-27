import React, { useState } from 'react';
import {
  Card, CardTitle, Button, Form, FormGroup, Input, FormFeedback, Alert,
} from 'reactstrap';
import { FaPlus } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as yup from 'yup';

const CREATE_ORG = gql`
  mutation CreateOrgCard_createOrgMutation($name: String, $orgSlug: String) {
    createOrg(name: $name, orgSlug: $orgSlug) {
      orgId
      orgSlug
    }
  }
`;

const CreateOrgCard = () => {
  const [creating, setCreating] = useState(false);
  const [createOrg] = useMutation(CREATE_ORG);

  return (
    <Card body>
      { creating
        ? (
          <Formik
            initialValues={{ name: '', orgSlug: '' }}
            validationSchema={yup.object().shape({
              name: yup.string().required('Organization name is required'),
              orgSlug: yup.string().required('Organization URL ID is required'),
            })}
            onSubmit={async (values, { setFieldError }) => {
              // createNeed({ variables: { title: values.title } }).then(({ data }) => {
              //   resetForm();
              //   history.push(`/${params.orgSlug}/${data.createNeed.nodeId}`);
              // });
              console.log('values', values);
              try {
                const { data } = await createOrg({
                  variables: {
                    name: values.name,
                    orgSlug: values.orgSlug,
                  },
                });
                console.log('data', data);
              } catch (err) {
                console.error("Couldn't create org:", err);
                setFieldError('general', err.message);
              }
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
              <Form onSubmit={handleSubmit}>
                {errors.general && <Alert color="danger">{errors.general}</Alert>}
                <FormGroup>
                  <Input
                    name="name"
                    type="text"
                    autoFocus
                    placeholder="Org name"
                    value={values.name}
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={errors.name && touched.name}
                  />
                  <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Input
                    name="orgSlug"
                    type="text"
                    placeholder="Org URL ID"
                    value={values.orgSlug}
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={errors.orgSlug && touched.orgSlug}
                  />
                  <FormFeedback>{errors.orgSlug}</FormFeedback>
                </FormGroup>
                <Button
                  size="sm"
                  type="submit"
                  disabled={!(values.name && values.orgSlug) || isSubmitting}
                >
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        )
        : (
          <>
            <CardTitle>
              Create a new organization
            </CardTitle>
            <Button onClick={() => setCreating(true)}>
              <FaPlus />
            </Button>
          </>
        )}
    </Card>
  );
};

export default CreateOrgCard;
