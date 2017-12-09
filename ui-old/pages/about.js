import React from 'react';
import PropTypes from 'prop-types';
import App from '../components/App';
import Header from '../components/Header';

function about(props) {
  return (
    <App>
      <Header pathname={props.url.pathname} />
      <article>
        <h1>About</h1>
        <p>
          A tool for tribal decentralised organisations.
        </p>
      </article>
    </App>
  );
}

about.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default about;
