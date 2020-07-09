import React from 'react';

import { Cell } from './cell';

// lock aspect ratio component
export const Aspect = ({ width, height, aspectRatio, setAspectRatio }) => {
  // on button click
  const onAspectClick = () => {
    // reset aspect ratio to 0 (unlink height and width)
    if (aspectRatio)
      setAspectRatio(0);
    // lock aspect ratio to current width/height ratio
    else
      setAspectRatio(width / height);
  };

  // render component
  return (
    <Cell
      text=' '
      tooltip={
        (aspectRatio ? 'Unlock' : 'Lock') +
        ' aspect ratio  –  ' +
        width +
        '/' +
        height +
        ' = ' +
        (width / height).toFixed(3)
      }
      control={
        <button className='square_control' onClick={onAspectClick}>
          {aspectRatio ? (
            <i className='fas fa-link'></i>
          ) : (
            <i className='fas fa-unlink'></i>
          )}
        </button>
      }
    />
  );
};
