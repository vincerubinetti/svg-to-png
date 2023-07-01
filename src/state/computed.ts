import { atom } from "jotai";
import { unstable_unwrap } from "jotai/utils";
import { files } from "@/state/files";
import { sourceToImage, sourceToSvg, unitsToPixels } from "@/util/svg";
import { toFixed } from "./../util/math";

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

          const handleError = (error: unknown) => {
            if (typeof error === "string") errorMessage += error;
            if (error instanceof Error) errorMessage += error.message;
            errorMessage += "\n";
          };

          try {
            svg = sourceToSvg(file.source);
          } catch (error) {
            handleError(error);
          }
          try {
            image = await sourceToImage(file.source);
          } catch (error) {
            handleError(error);
          }

          errorMessage = errorMessage.replace(/\n+/, "\n");

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

          /** final inferred dimensions of image */
          const inferred = {
            width: defaultWidth,
            height: defaultHeight,
          };

          if (absolute.width && absolute.height) {
            /** use absolute if available */
            inferred.width = absolute.width;
            inferred.height = absolute.height;
          } else if (absolute.width && viewBox.width && viewBox.height) {
            /** if only width specified, calc height from view box aspect */
            inferred.width = absolute.width;
            inferred.height = absolute.width * (viewBox.height / viewBox.width);
          } else if (absolute.height && viewBox.width && viewBox.height) {
            /** if only height specified, calc width from view box aspect */
            inferred.width = absolute.height * (viewBox.width / viewBox.height);
            inferred.height = absolute.height;
          } else if (viewBox.width && viewBox.height) {
            /** use view box if available */
            inferred.width = viewBox.width;
            inferred.height = viewBox.height;
          } else if (absolute.width) {
            /** use absolute width for both */
            inferred.width = absolute.width;
            inferred.height = absolute.width;
          } else if (absolute.height) {
            /** use absolute height for both */
            inferred.width = absolute.height;
            inferred.height = absolute.height;
          }

          /** dimension info table html */
          const info = `
            <table>
              <tr>
                <td>Specified</td>
                <td>
                  ${specified.width || "-"}</td>
                <td>×</td>
                <td>
                  ${specified.height || "-"}</td>
              </tr>
              <tr>
                <td>Absolute</td>
                <td>
                  ${absolute.width ? toFixed(absolute.width, 2) + "px" : "-"}
                </td>
                <td>×</td>
                <td>
                  ${absolute.height ? toFixed(absolute.height, 2) + "px" : "-"}
                </td>
              </tr>
              <tr>
                <td>View Box</td>
                <td>
                  ${viewBox.width ? toFixed(viewBox.width, 2) : "-"}
                </td>
                <td>×</td>
                <td>
                  ${viewBox.height ? toFixed(viewBox.height, 2) : "-"}
                </td>
              </tr>
              <tr>
                <td>Inferred</td>
                <td>
                  ${inferred.width ? toFixed(inferred.width, 2) + "px" : "-"}
                </td>
                <td>×</td>
                <td>
                  ${inferred.height ? toFixed(inferred.height, 2) + "px" : "-"}
                </td>
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
            inferred,
            info,
          };
        })
      ),
    (prev) => prev ?? null
  )
);
