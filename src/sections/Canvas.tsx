import type { Ref } from "react";
import type { Image } from "@/state";
import clsx from "clsx";
import { clamp } from "lodash";
import checkersDark from "@/assets/checkers-dark.svg";
import checkersLight from "@/assets/checkers-light.svg";
import { isSafari } from "@/util/browser";
import { getFilterId, sourceToImage } from "@/util/svg";

/** device pixel density at page load */
const dpr = window.devicePixelRatio;

type Props = Image & {
  ref?: Ref<HTMLCanvasElement>;
  className?: string;
};

/** draw svg image to canvas */
export default function Canvas({
  ref,
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
  darkPreview,
  className = "",
}: Props) {
  /** unique filter id */
  const filter = getFilterId();

  /** whether to use canvas svg method for color filter */
  const canvasFilter = color && !color.startsWith("~") && !isSafari;

  const drawCanvas = async (canvas: HTMLCanvasElement) => {
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
    } catch {}

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

    /** apply color tint with canvas svg filter */
    if (canvasFilter) ctx.filter = `url(#${filter})`;

    /** draw image to canvas */
    ctx.drawImage(image, target.x, target.y, target.width, target.height);
  };

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
      <canvas
        ref={(canvas) => {
          if (!canvas) return;
          drawCanvas(canvas);
          if (ref) {
            if (typeof ref === "function") ref(canvas);
            else ref.current = canvas;
          }
        }}
        className={clsx("bg-fixed bg-repeat", className)}
        width={width}
        height={height}
        style={{
          width: width / dpr + "px",
          height: height / dpr + "px",
          backgroundImage: `url("${darkPreview ? checkersDark : checkersLight}")`,
          backgroundSize: "16px 16px",
        }}
        title={name}
      />
    </>
  );
}
