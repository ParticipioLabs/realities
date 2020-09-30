import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FaExternalLinkAlt } from 'react-icons/fa';

const DescriptionWrapper = styled.div`
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  margin-bottom: 1rem;
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  padding: 0.5rem 0;
`;

const ButtonLabel = styled.span`
  margin-right: 0.5rem;
`;

const ResponsibilityDetails = ({ title, description, path }) => (
  <Fragment>
    <CardTitle>
      {title}
    </CardTitle>
    <DescriptionWrapper>
      <ReactMarkdown source={description} />
    </DescriptionWrapper>
    <Link
      to={path}
      target="_blank"
    >
      <Button color="primary">
        <ButtonLabel>
          View details
        </ButtonLabel>
        <FaExternalLinkAlt />
      </Button>
    </Link>
  </Fragment>
);

ResponsibilityDetails.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string.isRequired,
};

ResponsibilityDetails.defaultProps = {
  title: '',
  description: '',
};

export default ResponsibilityDetails;
