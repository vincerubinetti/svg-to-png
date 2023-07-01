import { DragEventHandler, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import Textbox from "@/components/Textbox";
import { addImages, clearImages, images, removeImage, setImage } from "@/state";
import classes from "./Input.module.css";

const Input = () => {
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const [getImages] = useAtom(images);

  /** click actual file input on button click */
  const onClick = () => input?.current?.click();

  /** upload file */
  const onLoad = async (files: FileList | null) => {
    if (!files) return;

    /** parse file uploads as text */
    const data = await Promise.all(
      Array.from(files).map(async (file) => ({
        filename: file.name,
        source: await file.text(),
      }))
    );

    /** add files to list */
    addImages(data);

    /** reset file input so the same file could be re-selected */
    if (input.current) input.current.value = "";
  };

  /** on button drag file over, set drag flag on */
  const onDragEnter = () => setDragging(true);

  /** add drag enter listener to window, because overlay not interactable until dragging started */
  useEffect(() => {
    window.addEventListener("dragenter", onDragEnter);
    () => window.removeEventListener("dragenter", onDragEnter);
  });

  /** on button drag file off, set drag flag off */
  const onDragLeave = () => setDragging(false);

  /** on button drag file */
  const onDragOver: DragEventHandler<HTMLDivElement> = (event) =>
    event.preventDefault();

  /** on button file drop */
  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    onLoad(event.dataTransfer.files);
  };

  return (
    <section>
      <h2>Input</h2>

      <div className={classes.buttons}>
        <input
          ref={input}
          onChange={(event) => onLoad(event.target?.files)}
          type="file"
          accept="image/svg+xml"
          multiple
          style={{ display: "none" }}
        />
        <Button
          onClick={onClick}
          data-tooltip="Load SVG files. Or drag and drop files onto window."
        >
          Load
          <FontAwesomeIcon icon={faUpload} />
        </Button>
        <Button
          className={classes.upload}
          onClick={clearImages}
          data-tooltip="Clear all files"
        >
          Clear
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </div>
      <div
        className={classes.overlay}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        data-dragging={dragging}
      >
        Drop SVG files
      </div>

      <div className={classes.grid}>
        {getImages.map((image, index) => (
          <div
            key={index}
            className={classes.cell}
            role="group"
            aria-label={image.name}
          >
            <div className={classes.top}>
              <Textbox
                value={image.filename}
                onChange={(value) => setImage(index, "filename", value)}
                data-tooltip="Filename"
              />
              <Button
                onClick={() => removeImage(index)}
                data-tooltip="Remove image"
                data-square
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
            <Textarea
              value={image.source}
              onChange={(value) => setImage(index, "source", value)}
              data-tooltip={`
                <p>SVG source code</p>
                ${image.info || ""}
              `}
            />
            {image.errorMessage && (
              <div className={classes.error}>{image.errorMessage}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Input;
