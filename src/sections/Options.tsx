import { useState } from "react";
import { useAtom } from "jotai";
import { faLink, faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Range from "@/components/Range";
import { computed, options, setOption } from "@/state";
import classes from "./Options.module.css";

const Options = () => {
  const [all, setAll] = useState(false);
  const [getComputed] = useAtom(computed);
  const [getOptions] = useAtom(options);

  if (!getOptions?.length) return <></>;

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
        {getOptions?.map((option, index) => (
          <div key={index} className={classes.option}>
            <span>{getComputed?.[index]?.name || ""}</span>
            <Range
              label="Width"
              min={0}
              max={10000}
              step={1}
              value={option.width || 0}
              onChange={(value) => setOption(all ? -1 : index, "width", value)}
              tooltip="Width of resulting PNG image, in pixels."
            />
            <Range
              label="Height"
              min={0}
              max={10000}
              step={1}
              value={option.height || 0}
              onChange={(value) => setOption(all ? -1 : index, "height", value)}
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
                !option.aspect
                  ? `Lock aspect ratio to ${(
                      option.width / option.height
                    ).toFixed(3)}`
                  : "Unlock aspect ratio"
              }
            >
              <FontAwesomeIcon icon={option.aspect ? faLink : faLinkSlash} />
            </Button>
            <Range
              label="Margin"
              min={-1000}
              max={1000}
              step={1}
              value={option.margin || 0}
              onChange={(value) => setOption(all ? -1 : index, "margin", value)}
              tooltip="How many pixels of space to add on each side."
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Options;
