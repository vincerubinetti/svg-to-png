import React from 'react';
import { useEffect } from 'react';

import { Cell } from './cell';
import { sourceToSvg } from './util';
import { sourceToImage } from './util';

// paste component
export const Paste = ({ source, setSource, setSvg, setImage }) => {
  useEffect(() => {
    const update = async () => {
      setSvg(sourceToSvg(source));
      setImage(await sourceToImage(source));
    };
    update();
  }, [setImage, setSvg, source]);

  const onPasteInputChange = (event) => {
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
