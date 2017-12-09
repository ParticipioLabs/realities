import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

function Header({ pathname }) {
  return (
    <header>
      <Link prefetch href="/">
        <button className={pathname === '/' && 'is-active'}>Home</button>
      </Link>

      <Link prefetch href="/about">
        <button className={pathname === '/about' && 'is-active'}>About</button>
      </Link>

      <style jsx>
        {`
          header {
            margin-bottom: 25px;
          }
          button {
            font-size: 14px;
            margin-right: 15px;
            text-decoration: none;
          }
          .is-active {
            text-decoration: underline;
          }
        `}
      </style>
    </header>
  );
}

Header.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Header;
