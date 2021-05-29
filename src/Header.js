import { Fragment } from 'react';
import React from 'react';
import classes from './style.css';

const Header = props => {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1> COVID VACCINATION CENTER </h1>
      </header>
    </Fragment>
  );
};

export default Header;
