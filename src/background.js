import React from 'react';

import { Cell } from './cell';

// background color component
export const Background = ({ transparent, background, setBackground }) => (
  <Cell
    text='Background Color'
    tooltip='What color to fill the background'
    icon='fas fa-palette'
    disabled={transparent}
    control={
      <input
        className='square_control'
        type='color'
        value={background}
        disabled={transparent}
        onChange={(event) => setBackground(event.target.value)}
      />
    }
  />
);
