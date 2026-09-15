import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";

export type Format = "png" | "jpeg" | "webp";

type Download = {
  canvas: HTMLCanvasElement;
  name: string;
  format: Format;
  quality: number;
};

/** turn canvas image into downloadable blob */
const canvasToBlob = ({ canvas, format, quality }: Download) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(Error("Couldn't convert canvas to blob"));
      },
      `image/${format}`,
      quality,
    ),
  );

/** download file */
const downloadFile = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};

/** download blob */
const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  downloadFile(url, name);
  URL.revokeObjectURL(url);
};

/** download single image from canvas */
export const downloadCanvas = async (download: Download) => {
  const blob = await canvasToBlob(download);
  const { name, format } = download;
  downloadBlob(blob, `${name}.${format}`);
};

/** download zip of files */
export const downloadZip = async (files: Download[]) => {
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all(
    files.map(async (download) => {
      const blob = await canvasToBlob(download);
      const { name, format } = download;
      return zipWriter.add(`${name}.${format}`, new BlobReader(blob));
    }),
  );
  const blob = await zipWriter.close();
  downloadBlob(blob, "images.zip");
};
