import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 0.5rem;
`;

const ListForm = ({
  inputName,
  placeholder,
  value,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Wrapper>
    <Form
      onSubmit={handleSubmit}
      data-cy="list-form"
    >
      <StyledFormGroup>
        <Input
          name={inputName}
          type="textarea"
          autoFocus
          rows={3}
          placeholder={placeholder}
          value={value}
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
          data-cy="list-form-name-input"
        />
      </StyledFormGroup>
      <Button
        size="sm"
        type="submit"
        disabled={!value || isSubmitting}
      >
        Save
      </Button>
    </Form>
  </Wrapper>
);

ListForm.propTypes = {
  inputName: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

ListForm.defaultProps = {
  inputName: '',
  placeholder: 'Enter text...',
  value: '',
  handleChange: () => null,
  handleBlur: () => null,
  handleSubmit: () => null,
  isSubmitting: false,
};

export default ListForm;
