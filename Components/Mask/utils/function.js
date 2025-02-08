import circle from "../../../../../assets/shape/circle.svg";
import flower from "../../../../../assets/shape/flower.svg";
import sketch from "../../../../../assets/shape/sketch.svg";
import triangle from "../../../../../assets/shape/triangle.svg";
import blob from "../../../../../assets/shape/blob.svg";
import hexagon from "../../../../../assets/shape/hexagon.svg";
import { isValidCSS } from "../../../../../../bpl-tools/utils/getCSS";
export const getMaskCSS = (id, value) => {
  const { isMask, shape, size, position, repeat } = value;
  const svgShape = [
    { svg: circle, type: "circle" },
    { svg: flower, type: "flower" },
    { svg: sketch, type: "sketch" },
    { svg: triangle, type: "triangle" },
    { svg: blob, type: "blob" },
    { svg: hexagon, type: "hexagon" },
  ];
  const getShape = (type) => svgShape.find((e) => e.type === type);
  return isMask
    ? `    #${id} {
      -webkit-mask-image:url(${
        shape.type === "custom" ? shape.url : getShape(shape.type).svg
      });
      -webkit-mask-size: ${size.type === "custom" ? size.scale : size.type};
      ${
        position.type === "custom"
          ? ` ${isValidCSS("-webkit-mask-position-x", position.x)}
          ${isValidCSS("-webkit-mask-position-y", position.y)}
    `
          : `${isValidCSS("-webkit-mask-position", position.type)}`
      }
      ${size.type !== "cover" ? `-webkit-mask-repeat: ${repeat};` : ""}
    }`
        .replace(/\s+/g, " ")
        .trim()
    : "";
};
