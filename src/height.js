import React from 'react';

import { Cell } from './cell';

// height component
export const Height = ({ setWidth, height, setHeight, aspectRatio }) => {
  // on input value change
  const onDimensionChange = (event) => {
    // update height
    setHeight(event.target.value);
    // update width also, if aspect ratio locked
    if (aspectRatio)
      setWidth(event.target.value * aspectRatio);
  };

  // render component
  return (
    <Cell
      text='Height'
      tooltip='Height of the final image in pixels'
      icon='fas fa-arrows-alt-v'
      control={
        <input
          className='small_control'
          type='number'
          min='2'
          max='100000'
          step='1'
          value={height}
          data-height
          onChange={onDimensionChange}
        />
      }
    />
  );
};
