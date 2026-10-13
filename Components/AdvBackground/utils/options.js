import { __ } from '@wordpress/i18n';

export const advGradientOptions = {
	type: 'linear',
	radialType: 'ellipse',
	colors: [
		{ color: '', position: 0 },
		{ color: '', position: 0 },
	],
	centerPositions: { x: 0, y: 0 },
	angel: 90,
};

export const imgAttachmentOptions = [
	{ label: __('Default'), value: 'initial' },
	{ label: __('Fixed'), value: 'fixed' },
	{ label: __('Scroll'), value: 'scroll' }
];

export const imgPositionOptions = [
	{ label: __('Default'), value: 'initial' },
	{ label: __('Center Center'), value: 'center center' },
	{ label: __('Center Left'), value: 'center left' },
	{ label: __('Center Right'), value: 'center right' },
	{ label: __('Top Center'), value: 'center top' },
	{ label: __('Top Left'), value: 'left top' },
	{ label: __('Top Right'), value: 'left bottom' },
	{ label: __('Bottom Center'), value: 'right center' },
	{ label: __('Bottom Left'), value: 'right top' },
	{ label: __('Bottom Right'), value: 'right bottom' },
	{ label: __('Custom'), value: 'custom' }
];

export const imgRepeatOptions = [
	{ label: __('Default'), value: 'initial' },
	{ label: __('Repeat'), value: 'repeat' },
	{ label: __('Repeat-X'), value: 'repeat-x' },
	{ label: __('Repeat-Y'), value: 'repeat-y' },
	{ label: __('No-Repeat'), value: 'no-repeat' }
];

export const imgSizeOptions = [
	{ label: __('Default'), value: 'initial' },
	{ label: __('Auto'), value: 'auto' },
	{ label: __('Cover'), value: 'cover' },
	{ label: __('Contain'), value: 'contain' },
	{ label: __('Custom'), value: 'custom' }
];
export const unitOptions = [
	{ label: 'px', value: 'px' },
	{ label: '%', value: '%' },
	{ label: 'em', value: 'em' },
];

export const bgTabs = [
	{ title: __('Color'), name: 'color' },
	{ title: __('Gradient'), name: 'gradient' },
	{ title: __('Image'), name: 'image' },
	{ title: __('Video'), name: 'video' }
];