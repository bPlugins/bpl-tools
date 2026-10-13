import { __ } from '@wordpress/i18n';

export const bgTypes = [
	{ label: __('Solid'), value: 'solid' },
	{ label: __('Gradient'), value: 'gradient' },
	{ label: __('Image'), value: 'image' },
];

export const attachments = [
	{ label: __('Default'), value: '' },
	{ label: __('Initial'), value: 'initial' },
	{ label: __('Scroll'), value: 'scroll' },
	{ label: __('Fixed'), value: 'fixed' },
	{ label: __('Local'), value: 'local' },
];

export const repeats = [
	{ label: __('Default'), value: '' },
	{ label: __('No Repeat'), value: 'no-repeat' },
	{ label: __('Repeat'), value: 'repeat' },
	{ label: __('Repeat X'), value: 'repeat-x' },
	{ label: __('Repeat Y'), value: 'repeat-y' },
];

export const sizes = [
	{ label: __('Default'), value: '' },
	{ label: __('Cover'), value: 'cover' },
	{ label: __('Auto'), value: 'auto' },
	{ label: __('Contain'), value: 'contain' },
];