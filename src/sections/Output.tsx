import { useState } from "react";
import { useAtom } from "jotai";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { Canvas } from "@/sections/Canvas";
import { computed } from "@/state/computed";
import { files } from "@/state/files";
import { options } from "@/state/options";
import { downloadPNG, downloadPNGs } from "@/util/download";
import classes from "./Output.module.css";

const Output = () => {
  const [dark, setDark] = useState(false);
  const [zip, setZip] = useState(false);
  const [getFiles] = useAtom(files);
  const [getComputed] = useAtom(computed);
  const [getOptions] = useAtom(options);

  if (!getFiles.length) return <></>;

  return (
    <section>
      <h2>Output</h2>

      {/* resulting png previews */}
      <div className={classes.results}>
        {getFiles.map((_, index) => (
          <fieldset key={index} className={classes.result}>
            <legend>{getComputed?.[index]?.name}.png</legend>
            <Canvas
              image={getComputed?.[index]?.image || null}
              width={getOptions?.[index]?.width || 0}
              height={getOptions?.[index]?.height || 0}
              originalWidth={getComputed?.[index]?.dimensions.width || 0}
              originalHeight={getComputed?.[index]?.dimensions.height || 0}
              fit={getOptions?.[index]?.fit || "contain"}
              margin={getOptions?.[index]?.margin || 0}
              background={getOptions?.[index]?.background || ""}
              data-dark={dark}
              data-tooltip="PNG preview"
            />
            <Button
              onClick={(event) =>
                downloadPNG(
                  (event.currentTarget as HTMLElement)
                    .previousElementSibling as HTMLCanvasElement,
                  getComputed?.[index]?.name || "image"
                )
              }
              data-tooltip="Download this PNG"
              data-square
            >
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </fieldset>
        ))}
      </div>

      {/* options */}
      <Checkbox
        label="Dark checkers"
        tooltip={`
          <p>Whether to show a dark checkerboard background for transparency.</p>
          <p>For previews only; does not show up in downloaded images.</p>
        `}
        value={dark}
        onChange={setDark}
      />

      {/* buttons */}
      <div className={classes.buttons}>
        <Button
          onClick={() =>
            downloadPNGs(
              [...document.querySelectorAll("canvas")].map((canvas, index) => ({
                canvas,
                filename: getComputed?.[index]?.name || "image",
              })),
              zip
            )
          }
          data-tooltip="Download all PNGs at once."
        >
          Download All
          <FontAwesomeIcon icon={faDownload} />
        </Button>
        <Checkbox
          label="Zip"
          tooltip="Whether to zip files together into single download."
          value={zip}
          onChange={setZip}
        />
      </div>
    </section>
  );
};

export default Output;
