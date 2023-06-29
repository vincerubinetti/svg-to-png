import { useState } from "react";
import { useAtom } from "jotai";
import {
  faLink,
  faLinkSlash,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Range from "@/components/Range";
import Select from "@/components/Select";
import Textbox from "@/components/Textbox";
import { computed } from "@/state/computed";
import { files } from "@/state/files";
import { options, resetOption, setOption } from "@/state/options";
import classes from "./Options.module.css";

const Options = () => {
  const [all, setAll] = useState(false);
  const [getFiles] = useAtom(files);
  const [getComputed] = useAtom(computed);
  const [getOptions] = useAtom(options);

  if (!getFiles?.length) return <></>;

  return (
    <section>
      <h2>Options</h2>

      <div>
        <Checkbox
          label="Edit all"
          tooltip="Whether to update all files together when tweaking an option value."
          value={all}
          onChange={setAll}
        />
      </div>

      <div className={classes.options}>
        {getOptions?.slice(0, getFiles.length).map((option, index) => (
          <fieldset key={index} className={classes.option}>
            {/* name */}
            <div className={classes.row}>
              <Button
                onClick={() => resetOption(all ? -1 : index)}
                data-tooltip="Reset all values to defaults."
                data-square
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
              <legend className={classes.title}>
                {getComputed?.[index]?.name || ""}
              </legend>
            </div>

            {/* size */}
            <div className={classes.row}>
              <Range
                min={0}
                max={10000}
                step={1}
                value={option.width || 0}
                onChange={(value) =>
                  setOption(all ? -1 : index, "width", value)
                }
                tooltip="Width of resulting PNG image, in pixels."
              />
              &times;
              <Range
                min={0}
                max={10000}
                step={1}
                value={option.height || 0}
                onChange={(value) =>
                  setOption(all ? -1 : index, "height", value)
                }
                tooltip="Height of resulting PNG image, in pixels."
              />
              <Button
                onClick={() =>
                  setOption(
                    all ? -1 : index,
                    "aspect",
                    option.aspect ? 0 : Infinity
                  )
                }
                data-tooltip={
                  (!option.aspect
                    ? "Lock aspect ratio"
                    : "Unlock aspect ratio") +
                  ` (${(option.width / option.height).toFixed(3)})`
                }
                data-square
                role="checkbox"
                aria-checked={!!option.aspect}
                aria-label="Whether to lock aspect ratio"
              >
                <FontAwesomeIcon icon={option.aspect ? faLink : faLinkSlash} />
              </Button>
            </div>

            {/* more */}
            <Range
              label="Margin"
              min={-1000}
              max={1000}
              step={1}
              value={option.margin || 0}
              onChange={(value) => setOption(all ? -1 : index, "margin", value)}
              tooltip="How many pixels of space to add on each side."
            />
            <Select
              label="Fit"
              options={["contain", "cover", "stretch"]}
              value={option.fit}
              onChange={(value) => setOption(all ? -1 : index, "fit", value)}
              tooltip={`
                <p>How to fit original SVG into resulting PNG size if the aspect ratio is different.</p>
                <ul>
                  <li>Contain = scale down so all image content lies within frame</li>
                  <li>Cover = scale up so image content completely covers frame</li>
                  <li>Stretch = distort aspect ratio to match frame</li>
                </ul>
              `}
            />
            <Textbox
              label="Bg."
              value={option.background}
              onChange={(value) =>
                setOption(all ? -1 : index, "background", value)
              }
              tooltip={`
                <p>Background color, with transparency. Examples:</p>
                <ul>
                  <li>blank or <code>transparent</code></li>
                  <li><code>maroon</code>, <code>navy</code>, <code>gold</code>, <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/named-color" target="_blank">etc.</a></li>
                  <li><code>#ff0000</code> (red)</li>
                  <li><code>#ff000080</code> (red, 50% transp.)</li>
                  <li><code>rgba(255, 0, 255, 50%)</code></li>
                  <li><code>hsla(180, 100%, 50%, 50%)</code></li>
                  <li>...or any other <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank">CSS color</a></li>
                </ul>
              `}
              resizable={true}
            />
          </fieldset>
        ))}
      </div>
    </section>
  );
};

export default Options;
