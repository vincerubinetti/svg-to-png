import React from 'react';
import { render } from 'react-dom';

import { Header } from './header';
import { Main } from './main';

import './index.css';

// get the initial, baseline pixel ratio
export const densityScale = window.devicePixelRatio;

// app component
const App = () => (
  <>
    <Header />
    <Main />
  </>
);

// run app component
render(<App />, document.getElementById('root'));
