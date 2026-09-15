import type { DragEventHandler } from "react";
import { useRef, useState } from "react";
import { useEventListener } from "@reactuses/core";
import { useAtomValue } from "jotai";
import { Lightbulb, Plus, Upload, X } from "lucide-react";
import Button from "@/components/Button";
import Help from "@/components/Help";
import TextBox from "@/components/TextBox";
import {
  addImages,
  clearImages,
  imagesAtom,
  newFile,
  removeImage,
  setImage,
} from "@/state";
import { formatNumber } from "@/util/string";

export default function Input() {
  /** file input element */
  const input = useRef<HTMLInputElement>(null);

  /** drag state */
  const [dragging, setDragging] = useState(false);

  /** images state */
  const images = useAtomValue(imagesAtom);

  /** click actual file input on button click */
  const onClick = () => input.current?.click();

  /** upload file */
  const onLoad = async (files: FileList | null) => {
    if (!files) return;

    /** parse file uploads as text */
    const data = await Promise.all(
      [...files].map(async (file) => ({
        source: await file.text(),
        filename: file.name,
      })),
    );

    /** add files to list */
    addImages(data);

    /** reset file input so same file can be re-selected */
    if (input.current) input.current.value = "";
  };

  /** on button drag file over, set drag flag on */
  const onDragEnter = () => setDragging(true);

  /** on window drag start (overlay not visible until drag start) */
  useEventListener("dragenter", onDragEnter);

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

      <div className="flex flex-wrap items-center justify-center gap-4 *:w-50">
        <Button onClick={onClick}>
          Upload
          <Upload />
        </Button>
        <Button onClick={() => addImages([newFile])}>
          {images.length ? "Add" : "Example"}
          {images.length ? <Plus /> : <Lightbulb />}
        </Button>
        <Button onClick={clearImages}>
          Clear
          <X />
        </Button>
        <input
          ref={input}
          onChange={(event) => onLoad(event.target.files)}
          type="file"
          accept="image/svg+xml"
          multiple
          className="hidden"
        />
      </div>

      <div className="text-center text-lg text-dark-gray">
        {images.length
          ? `${formatNumber(images.length)} image${images.length === 1 ? "" : "s"}`
          : "Upload or drag and drop SVG files"}
      </div>

      {dragging && (
        <div
          className="fixed inset-0 z-100 grid bg-black/75 p-8 text-xl text-white"
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="grid place-items-center rounded-md border-2 border-dashed border-white p-8">
            Drop SVG files
          </div>
        </div>
      )}

      {!!images.length && (
        <div className="flex w-full grow flex-col gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex items-start gap-8 max-md:flex-col max-md:items-stretch"
              role="group"
              aria-label={`${image.name}.svg`}
            >
              <div className="flex flex-1 items-center gap-4">
                <Button
                  onClick={() => removeImage(index)}
                  aria-label="Remove SVG"
                >
                  <X />
                </Button>
                <TextBox
                  className="grow"
                  placeholder="SVG file name"
                  value={image.name}
                  onChange={(value) => setImage(index, "name", value)}
                />
                <Help>
                  <dl>
                    <dt>Specified size</dt>
                    <dd>
                      {image.specified.width || "-"} ×{" "}
                      {image.specified.height || "-"}
                    </dd>
                    <dt>Specified size (px)</dt>
                    <dd>
                      {formatNumber(image.absolute.width) || "-"} ×{" "}
                      {formatNumber(image.absolute.height) || "-"}
                    </dd>
                    <dt>View Box</dt>
                    <dd>
                      {formatNumber(image.viewBox.x) || "-"}{" "}
                      {formatNumber(image.viewBox.y) || "-"}{" "}
                      {formatNumber(image.viewBox.width) || "-"}{" "}
                      {formatNumber(image.viewBox.height) || "-"}
                    </dd>
                    <dt>Decided default size</dt>
                    <dd>
                      {formatNumber(image.width)} × {formatNumber(image.height)}
                    </dd>
                    <dt>Contents</dt>
                    <dd>
                      {formatNumber(image.contents?.x) || "-"}{" "}
                      {formatNumber(image.contents?.y) || "-"}{" "}
                      {formatNumber(image.contents?.width) || "-"}{" "}
                      {formatNumber(image.contents?.height) || "-"}
                    </dd>
                    <dt>Contents + strokes</dt>
                    <dd>
                      {formatNumber(image.contentsStrokes?.x) || "-"}{" "}
                      {formatNumber(image.contentsStrokes?.y) || "-"}{" "}
                      {formatNumber(image.contentsStrokes?.width) || "-"}{" "}
                      {formatNumber(image.contentsStrokes?.height) || "-"}
                    </dd>
                  </dl>
                </Help>
              </div>
              <div className="flex flex-3 flex-col gap-2">
                <TextBox
                  placeholder="SVG source"
                  className="w-full"
                  multi
                  rows={3}
                  value={image.source}
                  onChange={(value) => setImage(index, "source", value)}
                />
                {image.errorMessage && (
                  <div
                    className="rounded-md bg-theme/10 p-2"
                    aria-label="SVG parsing error"
                  >
                    {image.errorMessage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
