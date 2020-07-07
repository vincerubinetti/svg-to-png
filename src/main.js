import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { Upload } from './upload';
import { Paste } from './paste';
import { Info } from './info';
import { Dimensions } from './dimensions';
import { Fit } from './fit';
import { Margin } from './margin';
import { Background } from './background';
import { Canvas } from './canvas';
import { Download } from './download';

import { Section } from './section';
import { Cell } from './cell';
import { Hr } from './hr';
import { Br } from './br';

import { unitsToPixels } from './util';
import { sourceToSvg } from './util';
import { sourceToImage } from './util';
import { defaultWidth } from './constants';
import { defaultHeight } from './constants';

import './main.css';

// main component
export const Main = () => {
  // component state
  const [show, setShow] = useState(true);

  // source state
  const [source, setSource] = useState('');
  const [filename, setFilename] = useState('');
  const [svg, setSvg] = useState(null);
  const [image, setImage] = useState(null);

  // extracted dimensions
  const specifiedWidth = svg?.getAttribute('width') || '';
  const specifiedHeight = svg?.getAttribute('height') || '';
  const viewBox = svg?.getAttribute('viewBox') || '';
  const absoluteWidth = unitsToPixels(specifiedWidth);
  const absoluteHeight = unitsToPixels(specifiedHeight);
  const viewBoxWidth = parseFloat(viewBox.split(/\s/)[2]);
  const viewBoxHeight = parseFloat(viewBox.split(/\s/)[3]);
  const originalWidth = absoluteWidth || viewBoxWidth || defaultWidth;
  const originalHeight = absoluteHeight || viewBoxHeight || defaultHeight;

  // dimensions state
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [aspectRatio, setAspectRatio] = useState(width / height);

  // margins state
  const [fit, setFit] = useState('stretch');
  const [margin, setMargin] = useState(0);

  // background state
  const [transparent, setTransparent] = useState(true);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const update = async () => {
      setSvg(sourceToSvg(source));
      setImage(await sourceToImage(source));
      if (source)
        setShow(true);
    };
    update();
  }, [source]);

  return (
    <main>
      <Section>
        <Upload {...{ setSource, setFilename }} />
        <Cell text='or' />
        <Paste {...{ source, setSource, setSvg, setImage }} />
        <Br />
        {show && (
          <Info
            {...{
              filename,
              viewBox,
              specifiedWidth,
              specifiedHeight,
              absoluteWidth,
              absoluteHeight
            }}
          />
        )}
      </Section>
      {show && (
        <>
          <Hr />
          <Section>
            <Dimensions
              {...{
                source,
                width,
                setWidth,
                height,
                setHeight,
                aspectRatio,
                setAspectRatio,
                originalWidth,
                originalHeight
              }}
            />
            <Br />
            <Fit {...{ fit, setFit }} />
            <Margin {...{ margin, setMargin }} />
            <Background {...{ transparent, setTransparent, color, setColor }} />
          </Section>
          <Hr />
          <Section>
            <Canvas
              {...{
                image,
                width,
                height,
                originalWidth,
                originalHeight,
                fit,
                margin,
                transparent,
                color
              }}
            />
            <Br />
            <Download {...{ filename }} />
          </Section>
        </>
      )}
    </main>
  );
};
