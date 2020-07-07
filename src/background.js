import React from 'react';

import { Cell } from './cell';

// background color section
export const Background = ({
  transparent,
  setTransparent,
  color,
  setColor
}) => (
  <>
    <Cell
      text='Transparent'
      tooltip='Whether to leave the background transparent or fill it with a color'
      icon='fas fa-fill-drip'
      control={
        <input
          className='tiny_control'
          type='checkbox'
          checked={transparent}
          onChange={(event) =>
            setTransparent(event.target.checked ? true : false)
          }
        />
      }
    />
    <Cell
      text='Background Color'
      tooltip='What color to fill the background'
      icon='fas fa-palette'
      style={{ opacity: transparent ? 0.2 : 1 }}
      control={
        <input
          className='square_control'
          type='color'
          value={color}
          disabled={transparent}
          onChange={(event) => setColor(event.target.value)}
        />
      }
    />
  </>
);
