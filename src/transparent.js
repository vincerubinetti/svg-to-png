import React from 'react';

import { Cell } from './cell';

// transparent background component
export const Transparent = ({ transparent, setTransparent }) => (
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
);
