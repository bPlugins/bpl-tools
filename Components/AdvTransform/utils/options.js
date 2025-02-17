const xy = { x: '', y: '' }

export const rotateResetValue = {
	desktop: { ...xy, z: '' },
	tablet: { ...xy, z: '' },
	mobile: { ...xy, z: '' },
	threeDRotate: false
};

export const offsetResetValue = {
	desktop: xy,
	tablet: xy,
	mobile: xy,
};
export const scaleResetValue = {
	isProportion: true,
	desktop: { ...xy, scale: '' },
	tablet: { ...xy, scale: '' },
	mobile: { ...xy, scale: '' },
};
export const skewResetValue = {
	desktop: xy,
	tablet: xy,
	mobile: xy,
};
