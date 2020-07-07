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

  const onUpload = async (target) => {
    const file = target?.files[0];
    const text = (await file.text()) || '';
    setSource(text);
    setFilename(file?.name?.replace(/.svg$/, ''));
    if (text || inputRef.current)
      inputRef.current.value = null;
  };

  const onUploadClick = () => inputRef?.current?.click();

  const onUploadChange = (event) => onUpload(event.target);

  const onUploadDragEnter = () => setUploadDrag(true);

  const onUploadDragLeave = () => setUploadDrag(false);

  const onUploadDragOver = (event) => event.preventDefault();

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
