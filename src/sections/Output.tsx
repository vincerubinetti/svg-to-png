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
import { all, Image, images, setImage } from "@/state";
import { downloadPng, downloadPngs, downloadZip } from "@/util/download";
import classes from "./Output.module.css";

const Output = () => {
  const [getImages] = useAtom(images);
  const [getAll] = useAtom(all);

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
                onClick={() => downloadPng(getPngs(getImages)[index])}
                data-tooltip="Download this PNG"
                data-square
              >
                <FontAwesomeIcon icon={faDownload} />
              </Button>
              <Button
                onClick={() =>
                  setImage(
                    getAll ? -1 : index,
                    "darkCheckers",
                    !image.darkCheckers
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
          </fieldset>
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

/** get list of canvases and filenames to download as pngs */
const getPngs = (getImages: Image[]) =>
  [...document.querySelectorAll("canvas")].map((canvas, index) => ({
    canvas,
    filename: getImages[index].name || "image",
  }));
