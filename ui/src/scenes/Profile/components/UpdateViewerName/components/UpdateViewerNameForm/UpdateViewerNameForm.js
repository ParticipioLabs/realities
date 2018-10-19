import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';

const UpdateViewerNameForm = ({
  inputName,
  placeholder,
  value,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Input
        name={inputName}
        placeholder={placeholder}
        value={value}
        disabled={isSubmitting}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </FormGroup>
    <Button
      type="submit"
      disabled={!value || isSubmitting}
    >
      Save
    </Button>
  </Form>
);

UpdateViewerNameForm.propTypes = {
  inputName: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

UpdateViewerNameForm.defaultProps = {
  inputName: '',
  placeholder: 'Enter text...',
  value: '',
  handleChange: () => null,
  handleBlur: () => null,
  handleSubmit: () => null,
  isSubmitting: false,
};

export default UpdateViewerNameForm;
