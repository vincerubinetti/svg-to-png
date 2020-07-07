import React from 'react';

import { Cell } from './cell';

// download section
export const Download = ({ filename }) => {
  const onDownload = () => {
    const uri = document
      .querySelector('canvas')
      ?.toDataURL('image/png')
      .replace('image/png', 'octet/stream');
    const link = document.createElement('a');
    link.href = uri;
    link.download = (filename || 'image') + '.png';
    link.click();
  };

  // render component
  return (
    <Cell
      tooltip='Download the final PNG image'
      control={
        <button className='control' onClick={onDownload}>
          <span>Download</span>
          <i className='fas fa-download'></i>
        </button>
      }
    />
  );
};
