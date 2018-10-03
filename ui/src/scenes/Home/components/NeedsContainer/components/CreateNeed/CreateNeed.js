import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import {
  Button,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import { GET_NEEDS } from '@/services/queries';

const CREATE_NEED = gql`
  mutation CreateNeed_createNeedMutation($title: String!) {
    createNeed(title: $title) {
      nodeId
      title
    }
  }
`;

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 0.5rem;
`;

const CreateNeed = withRouter(({ history }) => (
  <Mutation
    mutation={CREATE_NEED}
    update={(cache, { data: { createNeed } }) => {
      cache.writeData({ data: { showCreateNeed: false } });
      const { needs } = cache.readQuery({ query: GET_NEEDS });
      cache.writeQuery({
        query: GET_NEEDS,
        data: { needs: [createNeed].concat(needs) },
      });
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
          <Wrapper>
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
                disabled={!values.title || isSubmitting}
              >
                Submit
              </Button>
            </Form>
          </Wrapper>
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
