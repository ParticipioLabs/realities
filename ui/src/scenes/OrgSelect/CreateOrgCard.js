import React, { useState } from 'react';
import {
  Card, CardTitle, Button, Form, FormGroup, Input,
} from 'reactstrap';
import { FaPlus } from 'react-icons/fa';
import { Formik } from 'formik';
import * as yup from 'yup';

const CreateOrgCard = () => {
  const [creating, setCreating] = useState(false);

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
            onSubmit={(values, { resetForm }) => {
              // createNeed({ variables: { title: values.title } }).then(({ data }) => {
              //   resetForm();
              //   history.push(`/${params.orgSlug}/${data.createNeed.nodeId}`);
              // });
              console.log('potato', values);
            }}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
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
                  />
                  <Input
                    name="orgSlug"
                    type="text"
                    placeholder="Org URL ID"
                    value={values.orgSlug}
                    disabled={isSubmitting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormGroup>
                <Button
                  size="sm"
                  onClick={() => setCreating(false)}
                >
                  Cancel
                </Button>
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
