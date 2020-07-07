import React from 'react';

import { Cell } from './cell';

// margin component
export const Margin = ({ margin, setMargin }) => (
  <Cell
    text='Margin'
    tooltip='How many pixels of space to add on each side of the image'
    icon='fas fa-expand'
    control={
      <input
        className='small_control'
        type='number'
        min='-100'
        max='1000'
        step='1'
        value={margin}
        onChange={(event) => setMargin(event.target.value)}
      />
    }
  />
);
