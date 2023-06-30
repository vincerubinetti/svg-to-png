import { atom } from "jotai";
import { unstable_unwrap } from "jotai/utils";
import { files } from "@/state/files";
import { sourceToImage, sourceToSvg, unitsToPixels } from "@/util/svg";

/** default dimensions */
export const defaultWidth = 512;
export const defaultHeight = 512;

/** props computed/derived from input files */
export const computed = unstable_unwrap(
  atom(
    async (get) =>
      await Promise.all(
        get(files).map(async (file) => {
          let errorMessage = "";

          /** svg dom object, for convenient parsing */
          let svg = null;
          /** image dom object, for convenient drawing */
          let image = null;

          try {
            svg = sourceToSvg(file.source);
            image = await sourceToImage(file.source);
          } catch (error) {
            if (typeof error === "string") errorMessage = error;
            if (error instanceof Error) errorMessage = error.message;
          }

          /** filename, without extension */
          const name = file.name.replace(/\.svg$/, "");

          /** dimensions, exactly as specified in svg source */
          const specified = {
            width: svg?.getAttribute("width") || "",
            height: svg?.getAttribute("height") || "",
          };

          /** specified dimensions converted to pixels */
          const absolute = {
            width: unitsToPixels(specified.width),
            height: unitsToPixels(specified.height),
          };

          /** read viewBox attribute from svg source */
          const [x = 0, y = 0, width = 0, height = 0] = (
            svg?.getAttribute("viewBox") || ""
          )
            .split(/\s/)
            .map(parseFloat);
          /** viewBox, exactly as specified in svg source */
          const viewBox = { x, y, width, height };

          /** resulting dimensions */
          const dimensions = {
            width: absolute.width || viewBox.width || defaultWidth,
            height: absolute.height || viewBox.height || defaultHeight,
          };

          /** remove unhelpful bits of error message */
          [
            "This page contains the following errors:",
            "Below is a rendering of the page up to the first error.",
          ].forEach(
            (phrase) => (errorMessage = errorMessage.replace(phrase, ""))
          );

          const info = `
            <table>
              <tr>
                <td>Specified</td>
                <td>${specified.width || "-"}</td>
                <td>×</td>
                <td>${specified.height || "-"}</td>
              </tr>
              <tr>
                <td>Absolute</td>
                <td>${absolute.width || "-"}px</td>
                <td>×</td>
                <td>${absolute.height || "-"}px</td>
              </tr>
              <tr>
                <td>View Box</td>
                <td>${viewBox.width || "-"}</td>
                <td>×</td>
                <td>${viewBox.height || "-"}</td>
              </tr>
            </table>
          `;

          return {
            errorMessage,
            svg,
            image,
            name,
            specified,
            absolute,
            viewBox,
            dimensions,
            info,
          };
        })
      ),
    (prev) => prev ?? null
  )
);
