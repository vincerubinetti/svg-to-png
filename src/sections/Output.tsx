import { useState } from "react";
import { useAtom } from "jotai";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { Canvas } from "@/sections/Canvas";
import { computed, files, options } from "@/state";
import { downloadCanvas } from "@/util/download";
import classes from "./Output.module.css";

const Output = () => {
  const [dark, setDark] = useState(false);
  const [getFiles] = useAtom(files);
  const [getComputed] = useAtom(computed);
  const [getOptions] = useAtom(options);

  if (!getFiles.length) return <></>;

  return (
    <section>
      <h2>Output PNGs</h2>

      {/* resulting png previews */}
      <div className={classes.results}>
        {getFiles.map((_, index) => (
          <div key={index} className={classes.result}>
            <span>{getComputed?.[index]?.name}.png</span>
            <Canvas
              image={getComputed?.[index]?.image || null}
              width={getOptions?.[index]?.width || 0}
              height={getOptions?.[index]?.height || 0}
              originalWidth={getComputed?.[index]?.dimensions.width || 0}
              originalHeight={getComputed?.[index]?.dimensions.height || 0}
              fit={"contain"}
              margin={getOptions?.[index]?.margin || 0}
              transparent={true}
              background="#000000"
              data-dark={dark}
              data-tooltip="PNG preview"
            />
            <Button
              onClick={(event) =>
                downloadCanvas(
                  (event.target as HTMLElement)
                    .previousElementSibling as HTMLCanvasElement,
                  getComputed?.[index]?.name
                )
              }
              data-tooltip="Download PNG"
            >
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </div>
        ))}
      </div>

      {/* extra actions */}
      <div className={classes.buttons}>
        <Checkbox
          label="Dark checkers"
          tooltip="Whether to show a dark checkerboard background for transparency. For preview purposes only, does not show up in downloaded image."
          value={dark}
          onChange={setDark}
        />
        <Button
          onClick={() =>
            document
              .querySelectorAll("canvas")
              .forEach((canvas, index) =>
                downloadCanvas(canvas, getComputed?.[index]?.name)
              )
          }
        >
          Download All
          <FontAwesomeIcon icon={faDownload} />
        </Button>
      </div>
    </section>
  );
};

export default Output;
