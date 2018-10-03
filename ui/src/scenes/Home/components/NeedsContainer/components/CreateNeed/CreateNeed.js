import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  FormText,
} from 'reactstrap';

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 0.5rem;
`;

const CreateNeed = () => (
  <Wrapper>
    <Formik
      initialValues={{ title: '' }}
      validate={values => {
        let errors = {};
        if (!values.title) {
          errors.title = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log('submit', values);
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
          <StyledFormGroup>
            <Input
              name="title"
              type="textarea"
              rows={3}
              placeholder="Enter a title for the new need..."
              value={values.title}
              disabled={isSubmitting}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={(e) => {
                // Submit form if user hits Enter
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </StyledFormGroup>
          <Button
            size="sm"
            type="submit"
            disabled={!values.title || isSubmitting}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
);

export default CreateNeed;
