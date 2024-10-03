import { clamp } from "lodash";
import type { Image } from "@/state";
import { sourceToImage } from "@/util/svg";
import classes from "./Canvas.module.css";

const densityScale = window.devicePixelRatio;

type Props = Image & {
  tooltip: string;
};

/** draw svg to canvas */
export const Canvas = ({
  source,
  size,
  width,
  height,
  trim,
  margin,
  fit,
  background,
  color,
  darkCheckers,
  tooltip,
}: Props) => {
  /** draw canvas when rendering component */
  const drawCanvas = async (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    /** get draw context */
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /** clear existing contents */
    ctx.clearRect(0, 0, width, height);

    /** convert svg to image */
    let image = null;
    try {
      image = await sourceToImage(source, { trim, color });
    } catch (error) {
      //
    }

    if (!image) return;

    /** size to draw svg image onto canvas */
    const draw = {
      x: 0,
      y: 0,
      width: clamp(Math.abs(width) - margin * 2, 0, Infinity),
      height: clamp(Math.abs(height) - margin * 2, 0, Infinity),
    };

    /** calc aspect ratios */
    const sourceAspect = size.width / size.height;
    const drawAspect = draw.width / draw.height;

    /** scale down draw size to contain full svg within bounds of canvas */
    if (fit === "contain") {
      if (sourceAspect < drawAspect) draw.width = draw.height * sourceAspect;
      else draw.height = draw.width / sourceAspect;
    }

    /** scale up draw size to cover full canvas with svg */
    if (fit === "cover") {
      if (sourceAspect > drawAspect) draw.width = draw.height * sourceAspect;
      else draw.height = draw.width / sourceAspect;
    }

    /** center svg image within canvas */
    draw.x = (width - draw.width) / 2;
    draw.y = (height - draw.height) / 2;

    /** fill background */
    ctx.fillStyle = background.trim() || "transparent";
    ctx.fillRect(0, 0, width, height);

    /** draw svg image to canvas */
    ctx.drawImage(image, draw.x, draw.y, draw.width, draw.height);
  };

  /** render component */
  return (
    <>
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
    </>
  );
};
