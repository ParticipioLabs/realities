import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FormGroup, Label } from 'reactstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';
import InfoForm from '@/components/InfoForm';
import { FaChainBroken } from 'react-icons/lib/fa';

const ADD_REALITY_HAS_DELIBERATION = gql`
  mutation AddRealityHasDeliberation_addHasDeliberationMutation(
    $from: _RealityInput!
    $to: _InfoInput!
  ) {
    addRealityHasDeliberation(from: $from, to: $to) {
      from {
        nodeId
        deliberations {
          nodeId
          title
          url
        }
      }
    }
  }
`;


const InvalidUrlText = styled.span`
  color: #ff0000;
  font-weight: bold;
`;

const AddDeliberation = withRouter(({ nodeId }) => (
  <Mutation
    mutation={ADD_REALITY_HAS_DELIBERATION}

  >
    {createDeliberation => (
      <FormGroup>

        <Formik
          initialValues={{ url: '' }}
          validationSchema={yup.object().shape({
            url: yup.string().required('URL is required').url('Invalid URL'),
          })}
          onSubmit={(values, { resetForm }) => {
            createDeliberation({ variables: { from: { nodeId }, to: { url: values.url } } })
              .then(() => {
              resetForm();
            });
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            errors,
            touched,
            }) => (
              <div>
                <Label for="editDeliberationUrl">
                  Add a discussion reference {touched.url && errors.url &&
                    <InvalidUrlText>
                      <FaChainBroken /> {errors.url}
                    </InvalidUrlText>}
                </Label>
                <InfoForm
                  inputName="url"
                  placeholder="Enter a discussion URL..."
                  value={values.url}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
          )}
        </Formik>
      </FormGroup>
        )}
  </Mutation>
));

AddDeliberation.propTypes = {
  nodeId: PropTypes.string,
};

AddDeliberation.defaultProps = {
  nodeId: '',
};

export default AddDeliberation;
