export const defaultMaksValue= {
    isMask: true,
    shape: {type:"circle",url:""},
    size: {
      type: "center center",
      scale:"100%"
    },
    position: {
      type:"center center",
      x:50,
    y:50
    },
    repeat: "no-repeat",
  }
export const shapeOptions = [{ label: "Circle", value: "circle" }, { label: "Flower", value: "flower" }, { label: "Sketch", value: "sketch" }, { label: "Triangle", value: "triangle" }, { label: "Blob", value: "blob" }, { label: "Hexagon", value: "hexagon" }, { label: "Custom", value: "custom" }];

export const sizeOptions = [{ label: "Fit", value: "contain" }, { label: "Fill", value: "cover" }, { label: "Custom", value: "custom" }];

export const positionOptions = [{ label: "Center Center", value: "center center" }, { label: "Center Left", value: "center left" }, { label: "Center Right", value: "center right" }, { label: "Top Center", value: "center top" }, { label: "Top Left", value: "left top" }, { label: "Top Right", value: "left bottom" }, { label: "Bottom Center", value: "right center" }, { label: "Bottom Left", value: "right top" }, { label: "Bottom Right", value: "right bottom" }, { label: "Custom", value: "custom" }];

export const repeatOptions = [{ label: "No-repeat", value: "no-repeat" }, { label: "Repeat", value: "repeat" }, { label: "Repeat-x", value: "repeat-x" }, { label: "Repeat-y", value: "repeat-y" }, { label: "Round", value: "round" }, {label:"Space",value:"space"}];