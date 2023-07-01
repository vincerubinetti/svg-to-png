import { useState } from "react";
import { useAtom } from "jotai";
import { faDownload, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { Canvas } from "@/sections/Canvas";
import { images, setImage } from "@/state";
import { downloadPNG, downloadPNGs } from "@/util/download";
import classes from "./Output.module.css";

const Output = () => {
  const [zip, setZip] = useState(false);
  const [getImages] = useAtom(images);

  if (!getImages.length) return <></>;

  return (
    <section>
      <h2>Output</h2>

      <div className={classes.grid}>
        {getImages.map((image, index) => (
          <fieldset key={index} className={classes.cell}>
            <legend>{image.name}.png</legend>
            <Canvas
              image={image.image || null}
              width={image.width || 0}
              height={image.height || 0}
              originalWidth={image.inferred.width || 0}
              originalHeight={image.inferred.height || 0}
              fit={image.fit || "contain"}
              margin={image.margin || 0}
              background={image.background || ""}
              data-dark={image.darkCheckers}
              data-tooltip="PNG preview"
            />

            <div className={classes.actions}>
              <Button
                onClick={() => {
                  downloadPNG(
                    document.querySelectorAll("canvas")[index],
                    image.name || "image"
                  );
                }}
                data-tooltip="Download this PNG"
                data-square
              >
                <FontAwesomeIcon icon={faDownload} />
              </Button>
              <Button
                onClick={() =>
                  setImage(index, "darkCheckers", !image.darkCheckers)
                }
                data-tooltip={`Show ${
                  image.darkCheckers ? "light" : "dark"
                } checkerboard background for transparency preview.`}
                data-square
              >
                <FontAwesomeIcon icon={image.darkCheckers ? faSun : faMoon} />
              </Button>
            </div>
          </fieldset>
        ))}
      </div>

      <div className={classes.buttons}>
        <Button
          onClick={() =>
            downloadPNGs(
              [...document.querySelectorAll("canvas")].map((canvas, index) => ({
                canvas,
                filename: getImages[index].name || "image",
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
          tooltip="Zip images together into single download."
          value={zip}
          onChange={setZip}
        />
      </div>
    </section>
  );
};

export default Output;
