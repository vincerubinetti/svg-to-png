import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";

/** turn canvas image into data url */
const getCanvasURL = (canvas: HTMLCanvasElement) =>
  canvas.toDataURL("image/png").replace("image/png", "octet/stream");

/** download file from url and filename */
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

/** download single png from canvas */
export const downloadPNG = (canvas: HTMLCanvasElement, filename: string) =>
  downloadFile(getCanvasURL(canvas), filename + ".png");

/** download list of pngs canvases */
export const downloadPNGs = async (
  pngs: { canvas: HTMLCanvasElement; filename: string }[],
  zip: boolean
) => {
  if (zip) {
    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    await Promise.all(
      pngs.map(({ canvas, filename }) =>
        zipWriter.add(
          filename + ".png",
          new Data64URIReader(getCanvasURL(canvas))
        )
      )
    );
    const blob = await zipWriter.close();
    const url = window.URL.createObjectURL(blob);
    downloadFile(url, "svg-to-png.zip");
    window.URL.revokeObjectURL(url);
  } else {
    for (const { canvas, filename } of pngs) downloadPNG(canvas, filename);
  }
};
