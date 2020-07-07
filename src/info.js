import React from 'react';

import { Cell } from './cell';

// info section
export const Info = ({
  filename,
  viewBox,
  specifiedWidth,
  specifiedHeight,
  absoluteWidth,
  absoluteHeight
}) => (
  <>
    <Cell
      text='File Name'
      tooltip='Name of the loaded file'
      control={filename || '–'}
    />
    <Cell
      text='View Box'
      tooltip='The viewBox attribute specified in the SVG'
      control={viewBox || '–'}
    />
    <Cell
      text='Specified Size'
      tooltip='The width and height attributes specified in the SVG'
      control={(specifiedWidth || '–') + ' × ' + (specifiedHeight || '–')}
    />
    <Cell
      text='Absolute Size'
      tooltip='The specified width and height of the image converted to pixels'
      control={
        (absoluteWidth || '–') + 'px × ' + (absoluteHeight || '–') + 'px'
      }
    />
  </>
);
