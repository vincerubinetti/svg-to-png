import { useAtom } from "jotai";
import {
  faArrowsUpDown,
  faArrowsUpDownLeftRight,
  faCompress,
  faFillDrip,
  faLink,
  faLinkSlash,
  faRefresh,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Range from "@/components/Range";
import Select from "@/components/Select";
import Textbox from "@/components/Textbox";
import { makeLabel } from "@/components/tooltip";
import { all, images, resetOptions, setImage } from "@/state";
import { toFixed } from "@/util/math";
import classes from "./Options.module.css";

/** tooltips/aria labels for options */
const dimensionsLabel = "Width × height of resulting PNG image, in pixels.";
const marginLabel = "How many pixels of space to add on each side.";
const fitLabel = `
  <p>How to fit original SVG into resulting PNG size if the aspect ratio is different.</p>
  <ul>
    <li>Contain = scale down so all image content lies within frame</li>
    <li>Cover = scale up so image content completely covers frame</li>
    <li>Stretch = distort aspect ratio so image content fills frame</li>
  </ul>
`;
const backgroundLabel = `
  <p>Background color, with transparency.</p>
  <p>Examples:</p>
  <ul>
    <li>blank (100% transparent)</li>
    <li><code>maroon</code>, <code>navy</code>, <code>gold</code>, <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color" target="_blank">etc.</a></li>
    <li><code>#ff0000</code> (red)</li>
    <li><code>#ff000080</code> (red, 50% transp.)</li>
    <li><code>rgba(255, 0, 255, 50%)</code></li>
    <li><code>hsla(180, 100%, 50%, 50%)</code></li>
    <li>...or any other <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank">CSS color</a></li>
  </ul>
`;

const Options = () => {
  const [getImages] = useAtom(images);
  const [getAll, setAll] = useAtom(all);

  if (!getImages?.length) return <></>;

  return (
    <section>
      <h2>Options</h2>

      <div>
        <Checkbox
          label={
            <>
              <FontAwesomeIcon icon={faArrowsUpDown} />
              <span>Edit all</span>
            </>
          }
          tooltip="Update all images together when changing a value."
          value={getAll}
          onChange={setAll}
        />
      </div>

      <div className={classes.table}>
        <div>Image</div>
        <div data-tooltip={dimensionsLabel}>
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
          <span>Dimensions</span>
        </div>
        <div data-tooltip={marginLabel}>
          <FontAwesomeIcon icon={faCompress} />
          <span>Margin</span>
        </div>
        <div data-tooltip={fitLabel}>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
          <span>Fit</span>
        </div>
        <div data-tooltip={backgroundLabel}>
          <FontAwesomeIcon icon={faFillDrip} />
          <span>Background</span>
        </div>

        {getImages.map((image, index) => (
          <fieldset key={index} className={classes.row}>
            <div className={classes.subrow}>
              <Button
                onClick={() => resetOptions(getAll ? -1 : index)}
                data-tooltip="Reset all values to defaults."
                data-square
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
              <legend className={classes.title}>{image.name || ""}</legend>
            </div>

            <div className={classes.subrow}>
              <Range
                min={0}
                max={10000}
                step={1}
                value={image.width || 0}
                onChange={(value) =>
                  setImage(getAll ? -1 : index, "width", value)
                }
                tooltip={`
                  Default from SVG: ${toFixed(image.inferred.width || 0, 2)}
                `}
                aria-label="Width, in pixels"
              />
              ×
              <Range
                min={0}
                max={10000}
                step={1}
                value={image.height || 0}
                onChange={(value) =>
                  setImage(getAll ? -1 : index, "height", value)
                }
                tooltip={`
                  Default from SVG: ${toFixed(image.inferred.height || 0, 2)}
                `}
                aria-label="Height, in pixels"
              />
              <Button
                onClick={() =>
                  setImage(
                    getAll ? -1 : index,
                    "aspect",
                    image.aspect ? 0 : Infinity
                  )
                }
                data-tooltip={
                  (!image.aspect
                    ? "Lock aspect ratio"
                    : "Unlock aspect ratio") +
                  ` (${toFixed(image.width / image.height, 3)})`
                }
                data-square
              >
                <FontAwesomeIcon icon={image.aspect ? faLink : faLinkSlash} />
              </Button>
            </div>

            <Range
              min={-1000}
              max={1000}
              step={1}
              value={image.margin || 0}
              onChange={(value) =>
                setImage(getAll ? -1 : index, "margin", value)
              }
              aria-label={"Margin. " + makeLabel(marginLabel)}
            />
            <Select
              options={["contain", "cover", "stretch"]}
              value={image.fit}
              onChange={(value) => setImage(getAll ? -1 : index, "fit", value)}
              aria-label={"Fit. " + makeLabel(fitLabel)}
            />
            <Textbox
              value={image.background}
              onChange={(value) =>
                setImage(getAll ? -1 : index, "background", value)
              }
              resizable={true}
              aria-label={"Background. " + makeLabel(backgroundLabel)}
            />
          </fieldset>
        ))}
      </div>
    </section>
  );
};

export default Options;
