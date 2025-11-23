import { __ } from '@wordpress/i18n';

export const fontStyles = [
	{ label: __('Normal'), value: 'normal' },
	{ label: __('Italic'), value: 'italic' },
	{ label: __('Oblique'), value: 'oblique' }
];

export const textTransforms = [
	{ label: __('None'), value: 'none', icon: 'NO' },
	{ label: __('Capitalize'), value: 'capitalize', icon: 'Aa' },
	{ label: __('Uppercase'), value: 'uppercase', icon: 'AA' },
	{ label: __('Lowercase'), value: 'lowercase', icon: 'aa' }
];

export const textDecorations = [
	{ label: __('Default'), value: 'auto' },
	{ label: __('Underline'), value: 'underline' },
	{ label: __('Overline'), value: 'overline' },
	{ label: __('Line Through'), value: 'line-through' },
	{ label: __('None'), value: 'none' }
];