import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";

/** turn canvas image into data url */
const canvasToUrl = (canvas: HTMLCanvasElement, format: "png" | "jpeg") =>
  canvas.toDataURL(`image/${format}`);

/** download file from url and name */
const downloadFile = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};

type Download = {
  canvas: HTMLCanvasElement;
  name: string;
  format: "png" | "jpeg";
};

/** download single image from canvas */
export const downloadCanvas = ({ canvas, name, format }: Download) =>
  downloadFile(canvasToUrl(canvas, format), `${name}.${format}`);

/** download zip of files */
export const downloadZip = async (files: Download[]) => {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all(
    files.map(({ canvas, name, format }) =>
      zipWriter.add(
        `${name}.${format}`,
        new Data64URIReader(canvasToUrl(canvas, format)),
      ),
    ),
  );
  const blob = await zipWriter.close();
  const url = window.URL.createObjectURL(blob);
  downloadFile(url, "images.zip");
  window.URL.revokeObjectURL(url);
};
