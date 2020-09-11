import React from 'react';

import { Cell } from './cell';

// paste component
export const Paste = ({ source, setSource }) => {
  // on input text change
  const onPasteInputChange = (event) => {
    // update source code text
    setSource(event.target.value);
  };

  // render component
  return (
    <Cell
      text='Paste Source'
      tooltip='Copy and paste the source code text of an SVG'
      icon='fas fa-code'
      control={
        <textarea
          className='big_control'
          value={source}
          onChange={onPasteInputChange}
        />
      }
    />
  );
};
