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

const InfoForm = ({
  titleInputName,
  titlePlaceholder,
  titleValue,
  urlInputName,
  urlPlaceholder,
  urlValue,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Wrapper>
    <Form onSubmit={handleSubmit}>
      <StyledFormGroup>
        <Input
          name={titleInputName}
          type="textarea"
          rows={1}
          placeholder={titlePlaceholder}
          value={titleValue}
          disabled={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={(e) => {
            // Submit form if user hits Enter
            //if (e.key === 'Enter') {
            //  e.preventDefault();
            //  handleSubmit();
            //}
          }}
        />
        <Input
          name={urlInputName}
          type="textarea"
          rows={1}
          placeholder={urlPlaceholder}
          value={urlValue}
          disabled={isSubmitting}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={(e) => {
            // Submit form if user hits Enter
            //if (e.key === 'Enter') {
            //  e.preventDefault();
            //  handleSubmit();
            //}
          }}
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

InfoForm.propTypes = {
  titleInputName: PropTypes.string,
  titlePlaceholder: PropTypes.string,
  titleValue: PropTypes.string,
  urlInputName: PropTypes.string,
  urlPlaceholder: PropTypes.string,
  urlValue: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

InfoForm.defaultProps = {
  titleInputName: '',
  titlePlaceholder: 'Enter text...',
  titleValue: '',
  urlInputName: '',
  urlPlaceholder: 'Enter text...',
  urlValue: '',
  handleChange: () => null,
  handleBlur: () => null,
  handleSubmit: () => null,
  isSubmitting: false,
};

export default InfoForm;
