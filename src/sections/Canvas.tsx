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
  darkCheckers: boolean;
  tooltip: string;
};

/** draw svg to canvas */
export const Canvas = ({
  image,
  width,
  height,
  originalWidth,
  originalHeight,
  fit,
  margin,
  background,
  darkCheckers,
  tooltip,
}: Props) => {
  /** size to draw svg image onto canvas */
  let drawWidth = Math.abs(width) - margin * 2;
  let drawHeight = Math.abs(height) - margin * 2;

  /** calc aspect ratios */
  const originalAspect = originalWidth / originalHeight;
  const drawAspect = drawWidth / drawHeight;

  /** scale down draw size to contain full svg within bounds of canvas */
  const contain = () => {
    if (originalAspect < drawAspect) drawWidth = drawHeight * originalAspect;
    else drawHeight = drawWidth / originalAspect;
  };

  /** scale up draw size to cover full canvas with svg */
  const cover = () => {
    if (originalAspect > drawAspect) drawWidth = drawHeight * originalAspect;
    else drawHeight = drawWidth / originalAspect;
  };

  /** draw canvas when rendering component */
  const drawCanvas = (canvas: HTMLCanvasElement) => {
    if (!canvas) return;

    /** get draw context */
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    /** clear existing contents */
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
    <div
      className={classes.container}
      data-dark={darkCheckers}
      data-tooltip={tooltip}
      role="img"
    >
      <canvas
        ref={drawCanvas}
        width={width}
        height={height}
        style={{
          width: width / densityScale + "px",
          height: height / densityScale + "px",
        }}
      />
    </div>
  );
};
