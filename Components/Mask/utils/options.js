import { __ } from '@wordpress/i18n';

export const shapeOptions = [
	{ label: __('Circle'), value: 'circle' },
	{ label: __('Flower'), value: 'flower' },
	{ label: __('Sketch'), value: 'sketch' },
	{ label: __('Triangle'), value: 'triangle' },
	{ label: __('Blob'), value: 'blob' },
	{ label: __('Hexagon'), value: 'hexagon' },
	{ label: __('Custom'), value: 'custom' }
];

export const sizeOptions = [
	{ label: __('Fit'), value: 'contain' },
	{ label: __('Fill'), value: 'cover' },
	{ label: __('Custom'), value: 'custom' }
];

export const positionOptions = [
	{ label: __('Center Center'), value: 'center center' },
	{ label: __('Center Left'), value: 'center left' },
	{ label: __('Center Right'), value: 'center right' },
	{ label: __('Top Center'), value: 'top center' },
	{ label: __('Top Left'), value: 'top left' },
	{ label: __('Top Right'), value: 'top right' },
	{ label: __('Bottom Center'), value: 'bottom center' },
	{ label: __('Bottom Left'), value: 'bottom left' },
	{ label: __('Bottom Right'), value: 'bottom right' },
	{ label: __('Custom'), value: 'custom' }
];

export const repeatOptions = [
	{ label: __('No-repeat'), value: 'no-repeat' },
	{ label: __('Repeat'), value: 'repeat' },
	{ label: __('Repeat-x'), value: 'repeat-x' },
	{ label: __('Repeat-y'), value: 'repeat-y' },
	{ label: __('Round'), value: 'round' },
	{ label: __('Space'), value: 'space' }
];