import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { Upload } from './upload';
import { Paste } from './paste';
import { Info } from './info';
import { Width } from './width';
import { Height } from './height';
import { Aspect } from './aspect';
import { Reset } from './reset';
import { Fit } from './fit';
import { Margin } from './margin';
import { Transparent } from './transparent';
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
  const [show, setShow] = useState(false);

  // source state
  const [source, setSource] = useState(''); // source code text of svg
  const [filename, setFilename] = useState(''); // filename of svg
  const [svg, setSvg] = useState(null); // dom element for getting svg attributes
  const [image, setImage] = useState(null); // dom img element for drawing to canvas

  // extracted dimensions
  const specifiedWidth = svg?.getAttribute('width') || ''; // width, exactly as given in svg source
  const specifiedHeight = svg?.getAttribute('height') || ''; // height, exactly as given in svg source
  const viewBox = svg?.getAttribute('viewBox') || ''; // viewBox, exactly as given in svg source
  const absoluteWidth = unitsToPixels(specifiedWidth); // specified width converted to pixels
  const absoluteHeight = unitsToPixels(specifiedHeight); // specified height converted to pixels
  const viewBoxWidth = parseFloat(viewBox.split(/\s/)[2]); // width portion of viewBox
  const viewBoxHeight = parseFloat(viewBox.split(/\s/)[3]); // height portion of viewBox
  const originalWidth = absoluteWidth || viewBoxWidth || defaultWidth; // considered "width" of original svg
  const originalHeight = absoluteHeight || viewBoxHeight || defaultHeight; // considered "height" of original svg

  // dimensions state
  const [width, setWidth] = useState(defaultWidth); // width to make final image
  const [height, setHeight] = useState(defaultHeight); // height to make final image
  const [aspectRatio, setAspectRatio] = useState(width / height); // ratio to lock width/height to. 0 if width/height unlinked

  // margins state
  const [fit, setFit] = useState('stretch'); // fit mode. stretch, contain, or cover
  const [margin, setMargin] = useState(0); // pixels to add to each side of image

  // background state
  const [transparent, setTransparent] = useState(true); // whether to leave background transparent
  const [background, setBackground] = useState('#000000'); // what color to fill background

  // when source changes
  useEffect(() => {
    const update = async () => {
      // set svg and image
      setSvg(sourceToSvg(source));
      setImage(await sourceToImage(source));
      // show hidden UI elements
      if (source)
        setShow(true);
    };
    update();
  }, [source]);

  // when original size changes (because source changes)
  useEffect(() => {
    // reset dimensions
    setWidth(originalWidth);
    setHeight(originalHeight);
    // reset aspect ratio
    setAspectRatio(originalWidth / originalHeight);
  }, [originalWidth, originalHeight]);

  // when margin changes
  useEffect(() => {
    // don't let margin exceed half of image size
    const max = Math.min(width, height) / 2;
    if (margin > max)
      setMargin(max);
  }, [width, height, margin]);

  // render component
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
            <Width
              {...{
                width,
                setWidth,
                setHeight,
                aspectRatio
              }}
            />
            <Aspect {...{ width, height, aspectRatio, setAspectRatio }} />
            <Height
              {...{
                setWidth,
                height,
                setHeight,
                aspectRatio
              }}
            />
            <Reset
              {...{
                setWidth,
                setHeight,
                setAspectRatio,
                originalWidth,
                originalHeight
              }}
            />
            <Br />
            <Fit {...{ fit, setFit }} />
            <Margin {...{ margin, setMargin }} />
            <Transparent {...{ transparent, setTransparent }} />
            <Background {...{ transparent, background, setBackground }} />
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
                background
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
