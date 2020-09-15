import React from 'react';

import { Cell } from './cell';

import { densityScale } from './';
import { defaultWidth } from './constants';
import { defaultHeight } from './constants';

import './canvas.css';

// canvas component
export const Canvas = ({
  image,
  width,
  height,
  originalWidth,
  originalHeight,
  fit,
  margin,
  transparent,
  background
}) => {
  // size to draw svg image onto canvas
  let drawWidth = (Math.abs(width) || defaultWidth) - margin * 2;
  let drawHeight = (Math.abs(height) || defaultHeight) - margin * 2;

  // scale down draw size to contain full svg within bounds of canvas
  const contain = () => {
    if (originalWidth / originalHeight < drawWidth / drawHeight)
      drawWidth = (drawHeight * originalWidth) / originalHeight;
    else
      drawHeight = (drawWidth * originalHeight) / originalWidth;
  };

  // scale up draw size to cover full canvas with svg
  const cover = () => {
    if (originalWidth / originalHeight > drawWidth / drawHeight)
      drawWidth = (drawHeight * originalWidth) / originalHeight;
    else
      drawHeight = (drawWidth * originalHeight) / originalWidth;
  };

  // draw canvas when rendering component
  const drawCanvas = (canvas) => {
    // if canvas doesn't exist yet (first render), don't draw
    if (!canvas)
      return;

    // clear any existing contents on canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fill background
    if (!transparent) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // if no image to draw, don't draw
    if (!image)
      return;

    // run fit calculations
    if (fit === 'contain')
      contain();
    if (fit === 'cover')
      cover();

    // center svg image within canvas
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    // draw svg to canvas
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
  };

  // render component
  return (
    <Cell
      text='Result'
      tooltip='A preview of the resulting PNG image. It should appear at real, pixel-for-pixel size if the page zoom level is the same as when you opened it.'
      icon='fas fa-eye'
      controlId='canvas_frame'
      control={
        <canvas
          ref={drawCanvas}
          width={width}
          height={height}
          style={{
            width: width / densityScale + 'px',
            height: height / densityScale + 'px'
          }}
        />
      }
    />
  );
};
