import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';

const StyledForm = styled(Form)`
  margin-bottom: 1rem;
`;

const EditDetailsForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  cancel,
}) => (
  <StyledForm onSubmit={handleSubmit}>
    <FormGroup>
      <Label for="editDetailsTitle">
        Title
      </Label>
      <Input
        name="title"
        id="editDetailsTitle"
        value={values.title}
        disabled={isSubmitting}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={touched.title && errors.title}
      />
      <FormFeedback>
        {touched.title && errors.title}
      </FormFeedback>
    </FormGroup>
    <FormGroup>
      <Label for="editDetailsDescription">
        Description
      </Label>
      <Input
        name="description"
        id="editDetailsDescription"
        type="textarea"
        rows={3}
        value={values.description}
        disabled={isSubmitting}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={touched.description && errors.description}
      />
      <FormFeedback>
        {touched.description && errors.description}
      </FormFeedback>
    </FormGroup>
    <FormGroup>
      <Label for="editDetailsDeliberationLink">
        Deliberation
      </Label>
      <Input
        name="deliberationLink"
        id="editDetailsDeliberationLink"
        value={values.deliberationLink}
        disabled={isSubmitting}
        onChange={handleChange}
        onBlur={handleBlur}
        invalid={touched.deliberationLink && errors.deliberationLink}
      />
      <FormFeedback>
        {touched.deliberationLink && errors.deliberationLink}
      </FormFeedback>
      <FormText>
        Link to further discussion, planning, etc.
      </FormText>
    </FormGroup>
    <Button
      type="submit"
      color="primary"
      disabled={isSubmitting}
    >
      Submit
    </Button>
    <Button
      color="link"
      onClick={cancel}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
  </StyledForm>
);

EditDetailsForm.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    deliberationLink: PropTypes.string,
  }),
  errors: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    deliberationLink: PropTypes.string,
  }),
  touched: PropTypes.shape({
    title: PropTypes.bool,
    description: PropTypes.bool,
    deliberationLink: PropTypes.bool,
  }),
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  cancel: PropTypes.func,
};

EditDetailsForm.defaultProps = {
  values: {
    title: '',
    description: '',
    deliberationLink: '',
  },
  errors: {
    title: '',
    description: '',
    deliberationLink: '',
  },
  touched: {
    title: false,
    description: false,
    deliberationLink: false,
  },
  handleChange: () => null,
  handleBlur: () => null,
  handleSubmit: () => null,
  isSubmitting: false,
  cancel: () => null,
};

export default EditDetailsForm;
