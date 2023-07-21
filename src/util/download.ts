import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";

/** turn canvas image into data url */
const getCanvasUrl = (canvas: HTMLCanvasElement) =>
  canvas.toDataURL("image/png").replace("image/png", "octet/stream");

/** download file from url and filename */
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

type Png = { canvas: HTMLCanvasElement; name: string };

/** download single png from canvas */
export const downloadPng = ({ canvas, name }: Png) =>
  downloadFile(getCanvasUrl(canvas), name + ".png");

/** download list of pngs */
export const downloadPngs = async (pngs: Png[]) => pngs.forEach(downloadPng);

/** download zip of pngs */
export const downloadZip = async (pngs: Png[]) => {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all(
    pngs.map(({ canvas, name }) =>
      zipWriter.add(name + ".png", new Data64URIReader(getCanvasUrl(canvas))),
    ),
  );
  const blob = await zipWriter.close();
  const url = window.URL.createObjectURL(blob);
  downloadFile(url, "svg-to-png.zip");
  window.URL.revokeObjectURL(url);
};
