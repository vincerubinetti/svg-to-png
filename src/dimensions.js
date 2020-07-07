import React from 'react';
import { useEffect } from 'react';

import { Cell } from './cell';

// dimensions section
export const Dimensions = ({
  width,
  setWidth,
  height,
  setHeight,
  aspectRatio,
  setAspectRatio,
  originalWidth,
  originalHeight
}) => {
  const onDimensionChange = (event) => {
    const input = event.target;
    if (input.dataset.width) {
      setWidth(input.value);
      if (aspectRatio)
        setHeight(input.value / aspectRatio);
    }
    if (input.dataset.height) {
      setHeight(input.value);
      if (aspectRatio)
        setWidth(input.value * aspectRatio);
    }
  };

  const onAspectClick = () => {
    if (aspectRatio)
      setAspectRatio(0);
    else
      setAspectRatio(width / height);
  };

  const resetDimensions = () => {
    setWidth(originalWidth);
    setHeight(originalHeight);
    setAspectRatio(originalWidth / originalHeight);
  };

  useEffect(() => {
    setWidth(originalWidth);
    setHeight(originalHeight);
    setAspectRatio(originalWidth / originalHeight);
  }, [setWidth, setHeight, setAspectRatio, originalWidth, originalHeight]);

  // render component
  return (
    <>
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
      <Cell
        text=' '
        tooltip={
          (aspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio') +
          ' – ' +
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
      <Cell
        text=' '
        tooltip='Reset width and height to the original image dimensions'
        control={
          <button className='control' onClick={resetDimensions}>
            <span>Reset</span>
            <i className='fas fa-sync-alt'></i>
          </button>
        }
      />
    </>
  );
};
