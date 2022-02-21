import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { CssBaseline } from '@mui/material';
import App from './components/App';

render(
  <Fragment>
    <CssBaseline enableColorScheme/>
    <App />
  </Fragment>,
  document.getElementById('root')
);