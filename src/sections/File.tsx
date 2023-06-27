import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragEventHandler, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { cloneDeep } from "lodash";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import Textbox from "@/components/Textbox";
import { addFiles, clearFiles, computed, files, removeFile } from "@/state";
import classes from "./File.module.css";

const File = () => {
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const [getFiles, setFiles] = useAtom(files);
  const [getComputed] = useAtom(computed);

  /** click actual file input on button click */
  const onClick = () => input?.current?.click();

  /** upload file */
  const onLoad = async (files: FileList | null) => {
    if (!files) return;

    /** parse file uploads as text */
    const data = await Promise.all(
      Array.from(files).map(async (file) => ({
        name: file.name,
        source: await file.text(),
      }))
    );

    /** add files to list */
    addFiles(data);

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
    <>
      {/* buttons */}
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
          data-tooltip="Load SVG files. Or drag and drop file onto window."
        >
          Load
          <FontAwesomeIcon icon={faUpload} />
        </Button>
        <Button
          className={classes.upload}
          onClick={clearFiles}
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

      {/* files */}
      <div className={classes.files}>
        {getFiles.map((file, index) => (
          <div className={classes.file} key={index}>
            <Textbox
              value={file.name}
              onChange={(event) => {
                const newFiles = cloneDeep(getFiles);
                newFiles[index].name = event.target.value;
                setFiles(newFiles);
              }}
              aria-label="filename"
            />
            <Button
              onClick={() => removeFile(index)}
              data-tooltip="Remove file"
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
            <Textarea
              value={file.source}
              onChange={(event) => {
                const newFiles = cloneDeep(getFiles);
                newFiles[index].source = event.target.value;
                setFiles(newFiles);
              }}
              aria-label="file source code contents"
              data-tooltip={`
                <table>
                  <tr>
                    <td>
                      Specified size:
                    </td>
                    <td>
                      ${getComputed.data?.[index]?.specified.width || "-"}
                    </td>
                    <td>
                      &times;
                    </td>
                    <td>
                      ${getComputed.data?.[index]?.specified.height || "-"}
                    </td>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Absolute size:
                    </td>
                    <td>
                      ${getComputed.data?.[index]?.absolute.width || "-"}
                    </td>
                    <td>
                      &times;
                    </td>
                    <td>
                      ${getComputed.data?.[index]?.absolute.height || "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      View Box:
                    </td>
                    <td>
                      ${getComputed.data?.[index]?.viewBox.width || "-"}
                    </td>
                    <td>
                      &times;
                    </td>
                    <td>
                      ${getComputed.data?.[index]?.viewBox.height || "-"}
                    </td>
                  </tr>
                </table>
              `}
            />
            {getComputed.data?.[index]?.errorMessage && (
              <div className={classes.error}>
                {getComputed.data?.[index]?.errorMessage}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default File;
