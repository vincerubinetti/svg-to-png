import React from 'react';

import { Br } from './br';

import { ReactComponent as Svg } from './svg.svg';

import './header.css';

// header section
export const Header = () => (
  <header>
    <section>
      <div id='icons'>
        <Svg />
        <i className='fas fa-long-arrow-alt-right fa-xs'></i>
        <i className='fas fa-image'></i>
      </div>
      <Br />
      <div id='title'>SVG to PNG</div>
      <a
        id='view_on_github'
        href='https://github.com/vincerubinetti/svg-to-png'
      >
        <i className='fab fa-lg fa-github'></i>
        <span>on GitHub</span>
      </a>
    </section>
  </header>
);
