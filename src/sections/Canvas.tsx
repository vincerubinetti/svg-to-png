import { CanvasHTMLAttributes } from "react";
import classes from "./Canvas.module.css";

const densityScale = window.devicePixelRatio;

type Props = {
  image: HTMLImageElement | null;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  fit: string;
  margin: number;
  background: string;
} & CanvasHTMLAttributes<HTMLCanvasElement>;

/** canvas component */
export const Canvas = ({
  image,
  width,
  height,
  originalWidth,
  originalHeight,
  fit,
  margin,
  background,
  ...props
}: Props) => {
  /** size to draw svg image onto canvas */
  let drawWidth = Math.abs(width) - margin * 2;
  let drawHeight = Math.abs(height) - margin * 2;

  /** scale down draw size to contain full svg within bounds of canvas */
  const contain = () => {
    if (originalWidth / originalHeight < drawWidth / drawHeight)
      drawWidth = (drawHeight * originalWidth) / originalHeight;
    else drawHeight = (drawWidth * originalHeight) / originalWidth;
  };

  /** scale up draw size to cover full canvas with svg */
  const cover = () => {
    if (originalWidth / originalHeight > drawWidth / drawHeight)
      drawWidth = (drawHeight * originalWidth) / originalHeight;
    else drawHeight = (drawWidth * originalHeight) / originalWidth;
  };

  /** draw canvas when rendering component */
  const drawCanvas = (canvas: HTMLCanvasElement) => {
    if (!canvas) return;

    /** get draw context */
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    /** clear any existing contents on canvas */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /** fill background */
    ctx.fillStyle = background.trim() || "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!image) return;

    /** run fit calculations */
    if (fit === "contain") contain();
    if (fit === "cover") cover();

    /** center svg image within canvas */
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    /** draw svg to canvas */
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
  };

  /** render component */
  return (
    <canvas
      ref={drawCanvas}
      {...props}
      className={classes.canvas}
      width={width}
      height={height}
      style={{
        width: width / densityScale + "px",
        height: height / densityScale + "px",
      }}
    />
  );
};
