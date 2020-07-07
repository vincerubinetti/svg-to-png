import React from 'react';

import { Cell } from './cell';

import { defaultWidth } from './constants';
import { defaultHeight } from './constants';

import './canvas.css';

// canvas section
export const Canvas = ({
  image,
  width,
  height,
  originalWidth,
  originalHeight,
  fit,
  margin,
  transparent,
  color
}) => {
  width = Math.abs(width) || defaultWidth;
  height = Math.abs(height) || defaultHeight;

  const drawCanvas = (canvas) => {
    if (!canvas)
      return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    if (!transparent)
      ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!image)
      return;

    const containerRatio = width / height;
    const originalRatio = originalWidth / originalHeight;

    let w = width;
    let h = height;
    // scale width
    if (
      (fit === 'contain' && containerRatio > originalRatio) ||
      (fit === 'cover' && containerRatio < originalRatio)
    )
      w = (height * originalWidth) / originalHeight;
    // scale height
    if (
      (fit === 'contain' && containerRatio < originalRatio) ||
      (fit === 'cover' && containerRatio > originalRatio)
    )
      h = (width * originalHeight) / originalWidth;

    w -= margin * 2;
    h -= margin * 2;

    const x = (width - w) / 2;
    const y = (height - h) / 2;

    ctx.drawImage(image, x, y, w, h);
  };

  // render component
  return (
    <Cell
      text='Result'
      tooltip='A preview of the resulting PNG image. The downloaded image should appear exactly as it does here.'
      icon='fas fa-eye'
      controlId='canvas_frame'
      control={<canvas ref={drawCanvas} width={width} height={height} />}
    />
  );
};
