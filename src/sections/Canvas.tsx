import { clamp } from "lodash";
import type { Image } from "@/state";
import { sourceToImage } from "@/util/svg";
import classes from "./Canvas.module.css";

export const densityScale = window.devicePixelRatio;

type Props = Image & {
  tooltip: string;
};

/** draw svg image to canvas */
export const Canvas = ({
  source,
  name,
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
  const filter = getFilterId();

  /** whether to use canvas svg method for color filter */
  const canvasFilter = color && !color.startsWith("~") && !isSafari;

  /** when rendering component */
  const drawCanvas = async (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    /** get draw context */
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /** convert svg to image */
    let image = null;
    try {
      image = await sourceToImage(source, {
        trim,
        color: canvasFilter ? undefined : color,
      });
    } catch (error) {
      //
    }

    if (!image) return;

    /** size to draw image onto canvas */
    const target = {
      x: 0,
      y: 0,
      width: clamp(Math.abs(width) - margin * 2, 0, Infinity),
      height: clamp(Math.abs(height) - margin * 2, 0, Infinity),
    };

    /** calc aspect ratios */
    const sourceAspect = size.width / size.height;
    const targetAspect = target.width / target.height;

    /** scale down target size to contain full image within bounds of canvas */
    if (fit === "contain") {
      if (sourceAspect < targetAspect)
        target.width = target.height * sourceAspect;
      else target.height = target.width / sourceAspect;
    }

    /** scale up target size to cover full canvas with image */
    if (fit === "cover") {
      if (sourceAspect > targetAspect)
        target.width = target.height * sourceAspect;
      else target.height = target.width / sourceAspect;
    }

    /** center within canvas */
    target.x = (width - target.width) / 2;
    target.y = (height - target.height) / 2;

    /** clear existing contents */
    ctx.clearRect(0, 0, width, height);

    /** fill background */
    ctx.filter = "none";
    ctx.fillStyle = background.trim() || "transparent";
    ctx.fillRect(0, 0, width, height);

    /** apply color tint with canvas svg filter (doesn't work in safari) */
    if (canvasFilter) ctx.filter = `url(#${filter})`;

    /** draw image to canvas */
    ctx.drawImage(image, target.x, target.y, target.width, target.height);
  };

  /** render component */
  return (
    <>
      {canvasFilter && (
        <svg style={{ width: 0, height: 0 }}>
          <filter id={filter}>
            <feFlood floodColor={color} result="flood" />
            <feComposite operator="in" in="flood" in2="SourceAlpha" />
          </filter>
        </svg>
      )}
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
          title={name}
        />
      </div>
    </>
  );
};

/** get pseudo-unique id for filter */
export const getFilterId = () => "filter-" + String(Math.random()).slice(2);

/** is safari browser */
const isSafari = !!navigator.userAgent.match(/safari/i);
