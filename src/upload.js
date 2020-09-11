import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';

import { Cell } from './cell';

import './upload.css';

// upload component
export const Upload = ({ setSource, setFilename }) => {
  // component state
  const inputRef = useRef(null);
  const [uploadDrag, setUploadDrag] = useState(false);

  // on upload
  const onUpload = async (target) => {
    const file = target?.files[0];
    const text = (await file.text()) || '';
    setSource(text);
    setFilename(file?.name?.replace(/.svg$/, ''));
    if (text && inputRef.current)
      inputRef.current.value = null;
  };

  // on button click, click hidden file input
  const onUploadClick = () => inputRef?.current?.click();

  // on file input change
  const onUploadChange = (event) => onUpload(event.target);

  // on button drag file over, set drag flag on
  const onUploadDragEnter = () => setUploadDrag(true);

  // on button drag file off, set drag flag off
  const onUploadDragLeave = () => setUploadDrag(false);

  // on button drag file
  const onUploadDragOver = (event) => event.preventDefault();

  // on button file drop
  const onUploadDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadDrag(false);
    onUpload(event.dataTransfer);
  };

  // render component
  return (
    <>
      <input
        ref={inputRef}
        onChange={onUploadChange}
        type='file'
        accept='image/svg+xml'
        style={{ display: 'none' }}
      />
      <Cell
        text='Upload File'
        tooltip='Load an SVG file from your device'
        icon='fas fa-upload'
        control={
          <button
            id='upload_button'
            className='big_control'
            data-drag={uploadDrag}
            onClick={onUploadClick}
            onDragEnter={onUploadDragEnter}
            onDragLeave={onUploadDragLeave}
            onDragOver={onUploadDragOver}
            onDrop={onUploadDrop}
          >
            <span>Choose or drag file</span>
          </button>
        }
      />
    </>
  );
};
