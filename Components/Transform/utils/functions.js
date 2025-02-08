import { mobileBreakpoint, tabBreakpoint } from "../../../../../../bpl-tools/utils/data";
import { isExist } from "../../../../../../bpl-tools/utils/functions";
import { isValidCSS } from "../../../../../../bpl-tools/utils/getCSS";

// transition: background-color 0.3s ease, transform 0.5s ease-in-out; /* Multiple transitions */
// transition: background-color 0.3s ease 0.1s, transform 0.5s ease-in-out 0.2s; /* Delays added */

export const getTransformCSS = (selector, transform,isHover=false) => {
  // const { normal, hover } = transform || {};

  const generateTransformCSS = (value, device = "desktop") => {
    if (!isExist(value)) return "";
    const { skew, scale, rotate, offset, flipX, flipY } = value;
    const { threeDRotate } = rotate || {};
    const { isProportion } = scale || {};
    const transforms = [];
    //skew
    if (isExist(skew)) {
      if (isExist(skew[device]?.x)) transforms.push(`skewX(${skew[device].x}deg)`);
      if (isExist(skew[device]?.y)) transforms.push(`skewY(${skew[device].y}deg)`);
    }
    //scale
      if (isProportion) {
        if (isExist(scale[device]?.scale)) transforms.push(`scale(${scale[device].scale})`);
      } else {
        if (isExist(scale[device]?.x)) transforms.push(`scaleX(${scale[device].x})`);
        if (isExist(scale[device]?.y)) transforms.push(`scaleY(${scale[device].y})`);
      }

    //rotate
    if (isExist(rotate)) {
      if (isExist(rotate[device]?.z)) transforms.push(`rotateZ(${rotate[device].z}deg)`);
      if (threeDRotate) {
        if (isExist(rotate[device]?.x)) transforms.push(`rotateX(${rotate[device].x}deg)`);
        if (isExist(rotate[device]?.y)) transforms.push(`rotateY(${rotate[device].y}deg)`);
      }
    }

    //offset
    if (isExist(offset)) {
      if (isExist(offset[device]?.x)) transforms.push(`translateX(${offset[device].x})`);
      if (isExist(offset[device]?.y)) transforms.push(`translateY(${offset[device].y})`);
    }

    //flip
    if (isExist(flipX)) transforms.push(flipX ? "scaleX(-1)" : "");
    if (isExist(flipY)) transforms.push(flipY ? "scaleY(-1)" : "");

    if (transforms.length === 0) return "";

    return isValidCSS("transform", transforms.join(" "));
  };

  const sl = isHover ? `${selector}:hover` : selector;
  // ${isExist(hover?.transition)?`transition:transform ${hover.transition}ms ease-in-out`:'' }

  return `
    ${sl} {
      ${generateTransformCSS(transform, "desktop")}
    }
    ${tabBreakpoint}{
      ${sl} {
      ${generateTransformCSS(transform, "tablet")}
        }
    }
    ${mobileBreakpoint}{
      ${sl} {
      ${generateTransformCSS(transform, "mobile")}
        }
    }
  `;
  // return `
  //   ${sl} {
  //     ${generateTransformCSS(normal, "desktop")}
  //     ${isExist(hover?.transition)?`transition:transform ${hover.transition}ms ease-in-out`:'' }
  //   }
  //   ${tabBreakpoint}{
  //     ${sl} {
  //     ${generateTransformCSS(normal, "tablet")}
  //       }
  //   }
  //   ${mobileBreakpoint}{
  //     ${sl} {
  //     ${generateTransformCSS(normal, "mobile")}
  //       }
  //   }
  //   ${selector}:hover {
  //     ${generateTransformCSS(hover, "desktop")}
  //   }
  //   ${tabBreakpoint}{
  //     ${selector}:hover {
  //     ${generateTransformCSS(hover, "tablet")}
  //       }
  //   }
  //   ${mobileBreakpoint}{
  //     ${selector}:hover {
  //     ${generateTransformCSS(hover, "mobile")}
  //       }
  //   }
  // `;
};