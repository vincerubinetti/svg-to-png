import React from 'react';

import { Cell } from './cell';

// download component
export const Download = ({ filename }) => {
  // on button click
  const onDownload = () => {
    // transform canvas to URI
    const uri = document
      .querySelector('canvas')
      .toDataURL('image/png')
      .replace('image/png', 'octet/stream');
    // create link to URI and force click to download
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
