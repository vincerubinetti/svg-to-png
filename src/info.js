import React from 'react';

import { Cell } from './cell';

// file info section
export const Info = ({
  error,
  filename,
  viewBox,
  specifiedWidth,
  specifiedHeight,
  absoluteWidth,
  absoluteHeight
}) => (
  <>
    {error !== '' && (
      <Cell
        text='Parsing Error'
        tooltip='An error the browser gave when trying to parse the SVG'
        icon='fas fa-exclamation-triangle'
        control={error}
        color='var(--red)'
      />
    )}
    {error === '' && (
      <>
        <Cell
          text='Filename'
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
    )}
  </>
);
