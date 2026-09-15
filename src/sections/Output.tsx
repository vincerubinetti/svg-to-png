import type { Format } from "@/util/download";
import { useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Download, FileArchive, FileStack, Moon, Sun } from "lucide-react";
import Button from "@/components/Button";
import Help from "@/components/Help";
import NumberBox from "@/components/NumberBox";
import Select from "@/components/Select";
import Canvas from "@/sections/Canvas";
import { formatAtom, imagesAtom, qualityAtom, setImage } from "@/state";
import { downloadCanvas, downloadZip } from "@/util/download";

export default function Output() {
  /** canvas elements */
  const canvases = useRef<HTMLCanvasElement[]>([]);

  /** images state */
  const images = useAtomValue(imagesAtom);

  /** output format */
  const [format, setFormat] = useAtom(formatAtom);

  /** output quality */
  const [quality, setQuality] = useAtom(qualityAtom);

  /** whether all images use dark transparency preview pattern */
  const allDark = images.every((image) => image.darkPreview);

  /** get canvas details */
  const getCanvases = () =>
    canvases.current.map((canvas, index) => ({
      canvas,
      name: images[index]?.name ?? "",
      format,
      quality,
    }));

  return (
    <section>
      <h2>Output</h2>

      <div className="flex items-center gap-2">
        <Button onClick={() => setImage(-1, "darkPreview", !allDark)}>
          Transparency
          {allDark ? <Moon /> : <Sun />}
        </Button>
        <Help>
          Whether to use dark or light transparency preview pattern. Doesn't
          affect downloaded image.
        </Help>
      </div>

      <div className="grid grid-cols-[repeat(2,auto)] items-center justify-center gap-8 *:min-h-0 *:min-w-0 max-md:grid-cols-1 max-md:justify-items-center-safe">
        {images.map((image, index) => (
          <div
            key={index}
            className="contents"
            role="group"
            aria-label={image.name}
          >
            <div className="flex items-center justify-between gap-8">
              <div>{image.name}</div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    const canvas = canvases.current[index];
                    const name = images[index]?.name ?? "";
                    if (!canvas) return;
                    downloadCanvas({ canvas, name, format, quality });
                  }}
                  aria-label={`Download ${image.name}`}
                >
                  <Download />
                </Button>
                <Button
                  onClick={() =>
                    setImage(index, "darkPreview", !image.darkPreview)
                  }
                  aria-label={`${image.name} dark/light transparency preview pattern`}
                >
                  {image.darkPreview ? <Moon /> : <Sun />}
                </Button>
              </div>
            </div>

            <div
              className="flex max-h-screen max-w-full overflow-auto max-md:col-span-full"
              role="img"
            >
              <Canvas
                ref={(element) => {
                  if (!element) return;
                  canvases.current[index] = element;
                }}
                {...image}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <label>
          Quality
          <NumberBox
            min={0}
            max={1}
            step={0.01}
            value={quality}
            onChange={setQuality}
          />
        </label>
        <label>
          Format
          <Select
            options={["png", "jpeg", "webp"] as Format[]}
            value={format}
            onChange={setFormat}
            aria-label="Format"
          />
        </label>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => getCanvases().forEach(downloadCanvas)}>
          Download All
          <FileStack />
        </Button>
        <Button onClick={() => downloadZip(getCanvases())}>
          Download ZIP
          <FileArchive />
        </Button>
      </div>
    </section>
  );
}
