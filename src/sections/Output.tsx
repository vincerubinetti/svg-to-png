import { useAtomValue } from "jotai";
import { Download, FileStack, FileArchive, Moon, Sun } from "lucide-react";
import Canvas from "@/sections/Canvas";
import { imagesAtom, setImage } from "@/state";
import { downloadCanvas, downloadZip } from "@/util/download";
import Button from "@/components/Button";
import Help from "@/components/Help";
import Select from "@/components/Select";
import { useRef, useState } from "react";

export default function Output() {
  const canvases = useRef<HTMLCanvasElement[]>([]);

  const getCanvases = () =>
    canvases.current.map((canvas, index) => ({
      canvas,
      name: images[index]?.name ?? "",
      format,
    }));

  const images = useAtomValue(imagesAtom);

  const allDark = images.every((image) => image.darkPreview);

  const [format, setFormat] = useState<"png" | "jpeg">("png");

  return (
    <section>
      <h2>Output</h2>

      <div className="flex items-center gap-2 ">
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
                    downloadCanvas({ canvas, name, format });
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
              className="flex max-w-full overflow-auto max-md:col-span-full"
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
        <Select
          options={["png", "jpeg"]}
          value={format}
          onChange={setFormat}
          aria-label="Format"
        />
        <Button onClick={() => getCanvases().forEach(downloadCanvas)}>
          Download All
          <FileStack />
        </Button>
        <Button
          onClick={() => downloadZip(getCanvases())}
          data-tooltip="Zip PNGs together into single download."
        >
          Download ZIP
          <FileArchive />
        </Button>
      </div>
    </section>
  );
}
