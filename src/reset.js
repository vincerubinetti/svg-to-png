import React from 'react';

import { Cell } from './cell';

// reset dimensions component
export const Reset = ({
  setWidth,
  setHeight,
  setAspectRatio,
  originalWidth,
  originalHeight
}) => {
  // on button click
  const resetDimensions = () => {
    // reset dimensions to original size
    setWidth(originalWidth);
    setHeight(originalHeight);
    setAspectRatio(originalWidth / originalHeight);
  };

  // render component
  return (
    <Cell
      text=' '
      tooltip={
        'Reset width and height to the original image dimensions – ' +
        originalWidth +
        ' × ' +
        originalHeight
      }
      control={
        <button className='control' onClick={resetDimensions}>
          <span>Reset</span>
          <i className='fas fa-sync-alt'></i>
        </button>
      }
    />
  );
};
