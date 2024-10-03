import { useAtom } from "jotai";
import {
  faArrowsUpDown,
  faArrowsUpDownLeftRight,
  faCompress,
  faCropSimple,
  faFillDrip,
  faImage,
  faLink,
  faLinkSlash,
  faPaintBrush,
  faRefresh,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Numberbox from "@/components/Numberbox";
import Select from "@/components/Select";
import Textbox from "@/components/Textbox";
import { cleanLabel } from "@/components/tooltip";
import { editAll, images, resetOptions, setImage } from "@/state";
import classes from "./Options.module.css";

/** tooltips/aria labels for options */
const sizeLabel = "Width × height of output PNG image, in pixels.";
const marginLabel = "How many pixels of space to add on each side.";
const fitLabel = `
  <p>How to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit" target="_blank">fit</a> original SVG into specified size if aspect ratio is different.</p>
`;
const trimLabel = `
  <p>
    Whether to crop <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox" target="_blank"><code>viewBox</code></a> to contents of SVG.
  </p>
`;
const backgroundLabel = `
  <p>
    Fill transparent areas with this background <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank">CSS color</a>.
  </p>
`;
const colorLabel = `
  <p>
    Force non-transparent areas to this <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank">CSS color</a>.
  </p>
  <p>
    Prefix with a <code>~</code> to only set <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword" target="_blank"><code>currentColor</code></a> values.
  </p>
`;

const Options = () => {
  const [getImages] = useAtom(images);
  const [getEditAll, setEditAll] = useAtom(editAll);

  if (!getImages.length) return <></>;

  return (
    <section>
      <h2>Options</h2>

      <div className={classes.wrapper}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th className={classes.name}>
                <FontAwesomeIcon icon={faImage} />
                <span>Image</span>
              </th>
              <th data-tooltip={sizeLabel}>
                <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
                <span>Size</span>
              </th>
              <th></th>
              <th data-tooltip={trimLabel}>
                <FontAwesomeIcon icon={faCropSimple} />
                <span>Trim</span>
              </th>
              <th data-tooltip={marginLabel}>
                <FontAwesomeIcon icon={faCompress} />
                <span>Margin</span>
              </th>
              <th data-tooltip={fitLabel}>
                <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                <span>Fit</span>
              </th>
              <th data-tooltip={backgroundLabel}>
                <FontAwesomeIcon icon={faFillDrip} />
                <span>Bg.</span>
              </th>
              <th data-tooltip={colorLabel}>
                <FontAwesomeIcon icon={faPaintBrush} />
                <span>Color</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {getImages.map((image, index) => (
              <tr key={index} aria-label={cleanLabel(image.name)}>
                <td>
                  <Button
                    onClick={() => resetOptions(getEditAll ? -1 : index)}
                    data-tooltip="Reset all values to defaults."
                    data-square
                  >
                    <FontAwesomeIcon icon={faRefresh} />
                  </Button>
                </td>

                <td className={classes.name}>{image.name}</td>

                <td>
                  <div className={classes.cell}>
                    <Numberbox
                      min={0}
                      max={10000}
                      step={1}
                      value={image.width || 0}
                      onChange={(value) =>
                        setImage(getEditAll ? -1 : index, "width", value)
                      }
                      aria-label="Width, in pixels"
                    />
                    ×
                    <Numberbox
                      min={0}
                      max={10000}
                      step={1}
                      value={image.height || 0}
                      onChange={(value) =>
                        setImage(getEditAll ? -1 : index, "height", value)
                      }
                      aria-label="Height, in pixels"
                    />
                  </div>
                </td>

                <td>
                  <Button
                    onClick={() =>
                      setImage(
                        getEditAll ? -1 : index,
                        "aspectLock",
                        image.aspectLock ? 0 : Infinity,
                      )
                    }
                    data-tooltip={
                      (!image.aspectLock
                        ? "Lock aspect ratio"
                        : "Unlock aspect ratio") +
                      ` (${(image.width / image.height).toFixed(3)})`
                    }
                    data-square
                  >
                    <FontAwesomeIcon
                      icon={image.aspectLock ? faLink : faLinkSlash}
                    />
                  </Button>
                </td>

                <td>
                  <Checkbox
                    value={image.trim}
                    onChange={(value) =>
                      setImage(getEditAll ? -1 : index, "trim", value)
                    }
                    aria-label={"Trim. " + cleanLabel(trimLabel)}
                  />
                </td>

                <td>
                  <Numberbox
                    min={-1000}
                    max={1000}
                    step={1}
                    value={image.margin || 0}
                    onChange={(value) =>
                      setImage(getEditAll ? -1 : index, "margin", value)
                    }
                    aria-label={"Margin." + cleanLabel(marginLabel)}
                  />
                </td>

                <td>
                  <Select
                    options={["contain", "cover", "stretch"]}
                    value={image.fit}
                    onChange={(value) =>
                      setImage(getEditAll ? -1 : index, "fit", value)
                    }
                    aria-label={"Fit. " + cleanLabel(fitLabel)}
                  />
                </td>

                <td>
                  <Textbox
                    value={image.background}
                    onChange={(value) =>
                      setImage(getEditAll ? -1 : index, "background", value)
                    }
                    aria-label={"Background. " + cleanLabel(backgroundLabel)}
                  />
                </td>

                <td>
                  <Textbox
                    value={image.color}
                    onChange={(value) =>
                      setImage(getEditAll ? -1 : index, "color", value)
                    }
                    aria-label={"Color. " + cleanLabel(colorLabel)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <Checkbox
          label={
            <>
              <FontAwesomeIcon icon={faArrowsUpDown} />
              <span>Edit all</span>
            </>
          }
          tooltip="Update all images together when changing an option value."
          value={getEditAll}
          onChange={setEditAll}
        />
      </div>
    </section>
  );
};

export default Options;
