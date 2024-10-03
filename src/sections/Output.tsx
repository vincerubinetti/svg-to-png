import { useAtom } from "jotai";
import {
  faDownload,
  faFileZipper,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import { Canvas } from "@/sections/Canvas";
import type { Image } from "@/state";
import { editAll, images, setImage } from "@/state";
import { downloadPng, downloadPngs, downloadZip } from "@/util/download";
import { removeExt } from "@/util/svg";
import classes from "./Output.module.css";

const Output = () => {
  const [getImages] = useAtom(images);
  const [getEditAll] = useAtom(editAll);

  if (!getImages.length) return <></>;

  return (
    <section>
      <h2>Output</h2>

      <div className={classes.grid}>
        {getImages.map((image, index) => (
          <div
            key={index}
            className={classes.cell}
            role="group"
            aria-label={image.name + ".png"}
          >
            <div
              style={{
                maxWidth:
                  Math.max(image.width, 100) / window.devicePixelRatio + "px",
              }}
            >
              {removeExt(image.name)}.png
            </div>
            <Canvas {...image} tooltip="PNG preview" />

            <div className={classes.actions}>
              <Button
                onClick={() => downloadPng(getPngs(getImages)[index])}
                data-tooltip="Download this PNG"
                data-square
              >
                <FontAwesomeIcon icon={faDownload} />
              </Button>
              <Button
                onClick={() =>
                  setImage(
                    getEditAll ? -1 : index,
                    "darkCheckers",
                    !image.darkCheckers,
                  )
                }
                data-tooltip={`Show ${
                  image.darkCheckers ? "light" : "dark"
                } checkerboard background for transparency preview.`}
                data-square
              >
                <FontAwesomeIcon icon={image.darkCheckers ? faMoon : faSun} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className={classes.buttons}>
        <Button
          onClick={() => downloadPngs(getPngs(getImages))}
          data-tooltip="Download all PNGs as individual downloads."
        >
          Download All
          <FontAwesomeIcon icon={faDownload} />
        </Button>

        <Button
          onClick={() => downloadZip(getPngs(getImages))}
          data-tooltip="Zip PNGs together into single download."
        >
          Download Zip
          <FontAwesomeIcon icon={faFileZipper} />
        </Button>
      </div>
    </section>
  );
};

export default Output;

/** get list of canvases and names to download as pngs */
const getPngs = (getImages: Image[]) =>
  [...document.querySelectorAll("canvas")].map((canvas, index) => ({
    canvas,
    name: removeExt(getImages[index].name) || "image",
  }));
