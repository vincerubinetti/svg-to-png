import type { ReactNode } from "react";
import { Fragment } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Crop,
  ImageUpscale,
  LockKeyhole,
  LockOpen,
  Paintbrush,
  PaintBucket,
  RefreshCw,
  Scaling,
  SquareDimensions,
} from "lucide-react";
import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import Help from "@/components/Help";
import NumberBox from "@/components/NumberBox";
import Select from "@/components/Select";
import TextBox from "@/components/TextBox";
import { editAllAtom, imagesAtom, resetOptions, setImage } from "@/state";

/** help content for options */
const help: Record<string, ReactNode> = {
  size: <p>Width × height of output PNG image, in pixels.</p>,
  lock: <p>Lock/unlock aspect ratio.</p>,
  trim: (
    <p>
      Crop{" "}
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox"
        target="_blank"
      >
        <code>viewBox</code>
      </a>{" "}
      to contents.
    </p>
  ),
  margin: <p>How many pixels of space to add on each side.</p>,
  fit: (
    <p>
      How to{" "}
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit"
        target="_blank"
      >
        fit
      </a>{" "}
      original image into specified size, if aspect ratio is different.
    </p>
  ),
  background: (
    <p>
      Fill background with this{" "}
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value"
        target="_blank"
      >
        CSS color
      </a>
      .
    </p>
  ),
  color: (
    <>
      <p>
        Force non-transparent areas to this{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value"
          target="_blank"
        >
          CSS color
        </a>
        .
      </p>
      <p>
        Prefix with a <code>~</code> to only set{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword"
          target="_blank"
        >
          <code>currentColor</code>
        </a>
        .
      </p>
    </>
  ),
  reset: <p>Reset options to default values.</p>,
};

export default function Options() {
  /** images state */
  const images = useAtomValue(imagesAtom);

  /** edit all state */
  const [editAll, setEditAll] = useAtom(editAllAtom);

  return (
    <section>
      <h2>Options</h2>

      <div className="grid grid-cols-[1fr_1fr_auto_auto_1fr_auto_1fr_1fr_auto] gap-x-8 gap-y-4 overflow-x-auto p-1 *:flex *:items-center *:justify-center *:gap-2">
        <b></b>
        <b>
          <Scaling />
          Size
          <Help>{help.size}</Help>
        </b>
        <b>
          Lock
          <Help>{help.lock}</Help>
        </b>
        <b>
          <Crop />
          Trim
          <Help>{help.trim}</Help>
        </b>
        <b>
          <SquareDimensions />
          Margin
          <Help>{help.margin}</Help>
        </b>
        <b>
          <ImageUpscale />
          Fit
          <Help>{help.fit}</Help>
        </b>
        <b>
          <PaintBucket />
          Background
          <Help>{help.background}</Help>
        </b>
        <b>
          <Paintbrush />
          Color
          <Help>{help.color}</Help>
        </b>
        <b>
          Reset
          <Help>{help.reset}</Help>
        </b>

        {images.map((image, index) => {
          const ratio = getRatio(image.width / image.height);
          return (
            <Fragment key={index}>
              <div className="justify-start!">{image.name}</div>

              <div className="flex items-center gap-1">
                <NumberBox
                  className="w-0 min-w-24"
                  min={0}
                  max={10000}
                  step={1}
                  value={image.width || 0}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "width", value)
                  }
                  aria-label={`${image.name} width`}
                />
                ×
                <NumberBox
                  className="w-0 min-w-24"
                  min={0}
                  max={10000}
                  step={1}
                  value={image.height || 0}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "height", value)
                  }
                  aria-label={`${image.name} height`}
                />
              </div>

              <Button
                className="w-max"
                onClick={() =>
                  setImage(
                    editAll ? -1 : index,
                    "aspectLock",
                    image.aspectLock ? 0 : Infinity,
                  )
                }
                aria-label={[
                  image.name,
                  !image.aspectLock
                    ? "lock aspect ratio"
                    : "unlock aspect ratio",
                ].join(" ")}
              >
                <div className="flex grow text-xs tabular-nums">
                  <div className="w-4 -translate-y-2 text-right">
                    {ratio.numerator}
                  </div>
                  <svg viewBox="-1 -1 2 2" className="w-2" aria-label="over">
                    <line
                      stroke="currentColor"
                      x1={-1}
                      y1={1}
                      x2={1}
                      y2={-1}
                      strokeWidth={0.35}
                      pathLength={1}
                      strokeDasharray={ratio.approximate ? 0.2 : 0}
                    />
                  </svg>
                  <div className="w-4 translate-y-2 text-left">
                    {ratio.denominator}
                  </div>
                </div>
                {image.aspectLock ? <LockKeyhole /> : <LockOpen />}
              </Button>

              <div>
                <CheckBox
                  value={image.trim}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "trim", value)
                  }
                  aria-label={`${image.name} trim`}
                />
              </div>

              <div>
                <NumberBox
                  className="w-0 min-w-24"
                  min={-1000}
                  max={1000}
                  step={1}
                  value={image.margin || 0}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "margin", value)
                  }
                  aria-label={`${image.name} margin`}
                />
              </div>

              <div>
                <Select
                  options={["contain", "cover", "stretch"]}
                  value={image.fit}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "fit", value)
                  }
                  aria-label={`${image.name} fit`}
                />
              </div>

              <div>
                <TextBox
                  className="w-0 min-w-48"
                  value={image.background}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "background", value)
                  }
                  aria-label={`${image.name} background`}
                />
              </div>

              <div>
                <TextBox
                  className="w-0 min-w-48"
                  value={image.color}
                  onChange={(value) =>
                    setImage(editAll ? -1 : index, "color", value)
                  }
                  aria-label={`${image.name} color`}
                />
              </div>

              <div>
                <Button
                  onClick={() => resetOptions(editAll ? -1 : index)}
                  aria-label={`${image.name} reset`}
                >
                  <RefreshCw />
                </Button>
              </div>
            </Fragment>
          );
        })}
      </div>

      <label>
        <CheckBox value={editAll} onChange={setEditAll} />
        Edit all
        <Help>Update all images together when changing a value.</Help>
      </label>
    </section>
  );
}

/** get ratio from decimal */
const getRatio = (decimal: number, maxDenominator = 16) => {
  let bestNumerator = 1;
  let bestDenominator = 1;
  let bestError = Infinity;
  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(decimal * denominator);
    const error = Math.abs(decimal - numerator / denominator);
    if (error < bestError) {
      bestError = error;
      bestNumerator = numerator;
      bestDenominator = denominator;
    }
  }
  const approximate = bestError > 0.0000000001;
  return {
    approximate,
    numerator: bestNumerator,
    denominator: bestDenominator,
  };
};
