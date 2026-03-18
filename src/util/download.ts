import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";

/** turn canvas image into data url */
const getCanvasUrl = (canvas: HTMLCanvasElement) =>
  canvas.toDataURL("image/png").replace("image/png", "octet/stream");

/** download file from url and name */
const downloadFile = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};

export type Png = { canvas: HTMLCanvasElement; name: string; scale?: string; };

export const getPngFilename = (name: string, scale = "1x") =>
  name + (scale === "1x" ? "" : `@${scale}`) + ".png";

/** download single png from canvas */
export const downloadPng = ({ canvas, name, scale }: Png) =>
  downloadFile(getCanvasUrl(canvas), getPngFilename(name, scale));

/** download list of pngs */
export const downloadPngs = async (pngs: Png[]) => pngs.forEach(downloadPng);

/** download zip of pngs */
export const downloadZip = async (pngs: Png[]) => {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all(
    pngs.map(({ canvas, name, scale }) =>
      zipWriter.add(
        getPngFilename(name, scale),
        new Data64URIReader(getCanvasUrl(canvas)),
      ),
    ),
  );
  const blob = await zipWriter.close();
  const url = window.URL.createObjectURL(blob);
  downloadFile(url, "svg-to-png.zip");
  window.URL.revokeObjectURL(url);
};
