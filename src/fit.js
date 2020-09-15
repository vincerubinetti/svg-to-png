import React from 'react';

import { Cell } from './cell';

// fit method select component
export const Fit = ({ fit, setFit }) => (
  <Cell
    text='Fit'
    tooltip='How to fit the original image into the final container'
    icon='fas fa-expand-alt'
    control={
      <select
        className='small_control'
        value={fit}
        onChange={(event) => setFit(event.target.value)}
      >
        <option>stretch</option>
        <option>contain</option>
        <option>cover</option>
      </select>
    }
  />
);
