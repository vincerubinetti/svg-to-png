export const downloadCanvas = (
  canvas: HTMLCanvasElement,
  filename = "image"
) => {
  const uri = canvas
    .toDataURL("image/png")
    .replace("image/png", "octet/stream");
  const link = document.createElement("a");
  link.href = uri;
  link.download = filename + ".png";
  link.click();
};
