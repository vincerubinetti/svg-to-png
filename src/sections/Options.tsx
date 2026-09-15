import type { ReactNode } from "react";
import { Fragment } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Crop,
  ImageUpscale,
  Link,
  Paintbrush,
  PaintBucket,
  RefreshCw,
  Scaling,
  SquareDimensions,
  Unlink,
} from "lucide-react";
import Button from "@/components/Button";
import CheckBox from "@/components/CheckBox";
import Help from "@/components/Help";
import NumberBox from "@/components/NumberBox";
import Select from "@/components/Select";
import TextBox from "@/components/TextBox";
import { editAllAtom, imagesAtom, resetOptions, setImage } from "@/state";

/** tooltips for options */
const tooltips: Record<string, ReactNode> = {
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
  const images = useAtomValue(imagesAtom);
  const [editAll, setEditAll] = useAtom(editAllAtom);

  return (
    <section>
      <h2>Options</h2>

      <div className="grid grid-cols-[repeat(9,auto)] place-content-center-safe gap-x-8 gap-y-4 overflow-x-auto pb-1 *:flex *:items-center *:justify-center *:gap-2">
        <b></b>
        <b>
          <Scaling />
          Size
          <Help>{tooltips.size}</Help>
        </b>
        <b>
          Lock
          <Help>{tooltips.lock}</Help>
        </b>
        <b>
          <Crop />
          Trim
          <Help>{tooltips.trim}</Help>
        </b>
        <b>
          <SquareDimensions />
          Margin
          <Help>{tooltips.margin}</Help>
        </b>
        <b>
          <ImageUpscale />
          Fit
          <Help>{tooltips.fit}</Help>
        </b>
        <b>
          <PaintBucket />
          Background
          <Help>{tooltips.background}</Help>
        </b>
        <b>
          <Paintbrush />
          Color
          <Help>{tooltips.color}</Help>
        </b>
        <b>
          Reset
          <Help>{tooltips.reset}</Help>
        </b>

        {images.map((image, index) => (
          <Fragment key={index}>
            <div className="justify-start!">{image.name}</div>

            <div className="flex items-center gap-1">
              <NumberBox
                className="w-24"
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
                className="w-24"
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

            <div>
              <Button
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
                {image.aspectLock ? <Link /> : <Unlink />}
              </Button>
            </div>

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
                className="w-24"
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
                className="w-32"
                value={image.background}
                onChange={(value) =>
                  setImage(editAll ? -1 : index, "background", value)
                }
                aria-label={`${image.name} background`}
              />
            </div>

            <div>
              <TextBox
                className="w-32"
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
        ))}
      </div>

      <CheckBox value={editAll} onChange={setEditAll}>
        Edit all
        <Help>Update all images together when changing a value.</Help>
      </CheckBox>
    </section>
  );
}
