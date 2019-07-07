import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CardText, CardTitle } from 'reactstrap';

const PersonDetails = ({ name, email }) => (
  <Fragment>
    {name ? (
      <Fragment>
        <CardTitle>
          {name}
        </CardTitle>
        <CardText>
          {email}
        </CardText>
      </Fragment>
    ) : (
      <CardTitle>
        {email}
      </CardTitle>
    )}
  </Fragment>
);

PersonDetails.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string.isRequired,
};

PersonDetails.defaultProps = {
  name: null,
};

export default PersonDetails;
