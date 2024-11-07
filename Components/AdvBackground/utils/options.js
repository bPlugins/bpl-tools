import { __ } from '@wordpress/i18n';

export const advGradientOptions = {
	type: "linear",
	radialType: "ellipse",
	colors: [
		{ color: "", position: 0 },
		{ color: "", position: 0 },
	],
	centerPositions: { x: 0, y: 0 },
	angel: 90,
};

export const imgAttachmentOptions = [
	{ label: "Default", value: "initial" },
	{ label: "Fixed", value: "fixed" },
	{ label: "Scroll", value: "scroll" },
];

export const imgPositionOptions = [
	{ label: "Default", value: "initial" },
	{ label: "Center Center", value: "center center" },
	{ label: "Center Left", value: "center left" },
	{ label: "Center Right", value: "center right" },
	{ label: "Top Center", value: "center top" },
	{ label: "Top Left", value: "left top" },
	{ label: "Top Right", value: "left bottom" },
	{ label: "Bottom Center", value: "right center" },
	{ label: "Bottom Left", value: "right top" },
	{ label: "Bottom Right", value: "right bottom" },
	{ label: "Custom", value: "custom" },
];
export const imgRepeatOptions = [
	{ label: "Default", value: "initial" },
	{ label: "Repeat", value: "repeat" },
	{ label: "Repeat-X", value: "repeat-x" },
	{ label: "Repeat-Y", value: "repeat-y" },
	{ label: "No-Repeat", value: "no-repeat" },
];

export const imgSizeOptions = [
	{ label: "Default", value: "initial" },
	{ label: "Auto", value: "auto" },
	{ label: "Cover", value: "cover" },
	{ label: "Contain", value: "contain" },
	{ label: "Custom", value: "custom" },
];
export const unitOptions = [
	{ label: "px", value: "px" },
	{ label: "%", value: "%" },
	{ label: "em", value: "em" },
];

export const bgTabs = [
	{ title: __('Color'), name: 'color' },
	{ title: __('Gradient'), name: 'gradient' },
	{ title: __('Image'), name: 'image' },
	{ title: __('Video'), name: 'video' }
];