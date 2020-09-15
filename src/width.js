import React from 'react';

import { Cell } from './cell';

// width component
export const Width = ({ width, setWidth, setHeight, aspectRatio }) => {
  const onDimensionChange = (event) => {
    // update width
    setWidth(event.target.value);
    // update height also, if aspect ratio locked
    if (aspectRatio)
      setHeight(event.target.value / aspectRatio);
  };

  // render component
  return (
    <Cell
      text='Width'
      tooltip='Width of the final image in pixels'
      icon='fas fa-arrows-alt-h'
      control={
        <input
          className='small_control'
          type='number'
          min='2'
          max='100000'
          step='1'
          value={width}
          data-width
          onChange={onDimensionChange}
        />
      }
    />
  );
};
