import { __ } from '@wordpress/i18n';

export const normalHoverTabs = [
	{ title: __('Normal'), name: 'normal' },
	{ title: __('Hover'), name: 'hover' }
];

export const borderStyles = [
	{ label: 'Solid', value: 'solid' },
	{ label: 'Dashed', value: 'dashed' },
	{ label: 'Dotted', value: 'dotted' },
	{ label: 'Double', value: 'double' },
	{ label: 'Groove', value: 'groove' },
	{ label: 'Inset', value: 'inset' },
	{ label: 'Outset', value: 'outset' },
	{ label: 'Ridge', value: 'ridge' }
];

export const pxUnit = (def = 0) => ({ value: 'px', label: 'px', default: def });
export const perUnit = (def = 0) => ({ value: '%', label: '%', default: def });
export const emUnit = (def = 0) => ({ value: 'em', label: 'em', default: def });
export const remUnit = (def = 0) => ({ value: 'rem', label: 'rem', default: def });
export const vwUnit = (def = 0) => ({ value: 'vw', label: 'vw', default: def });
export const vhUnit = (def = 0) => ({ value: 'vh', label: 'vh', default: def });

export const sides = [
	{ value: 'all', label: 'All Sides' },
	{ value: 'top', label: 'Top' },
	{ value: 'right', label: 'Right' },
	{ value: 'bottom', label: 'Bottom' },
	{ value: 'left', label: 'Left' },
	{ value: 'topRight', label: 'Top Right' },
	{ value: 'topBottom', label: 'Top Bottom' },
	{ value: 'topLeft', label: 'Top Left' },
	{ value: 'topRightBottom', label: 'Top Right Bottom' },
	{ value: 'topRightLeft', label: 'Top Right Left' },
	{ value: 'topBottomLeft', label: 'Top Bottom Left' },
	{ value: 'rightBottom', label: 'Right Bottom' },
	{ value: 'rightLeft', label: 'Right Left' },
	{ value: 'rightBottomLeft', label: 'Right Bottom Left' },
	{ value: 'bottomLeft', label: 'Bottom Left' }
];

export const gradients = [
	{
		name: 'Rose Pink',
		slug: 'rose-pink',
		gradient: 'linear-gradient(135deg, #F64C7F, #FC8CAD)'
	},
	{
		name: 'Sky Blue',
		slug: 'sky-blue',
		gradient: 'linear-gradient(135deg, #0040E3, #18D4FD)'
	},
	{
		name: 'Sunset Orange',
		slug: 'sunset-orange',
		gradient: 'linear-gradient(135deg, #E47B00, #FFB460)'
	},
	{
		name: 'Emerald Green',
		slug: 'emerald-green',
		gradient: 'linear-gradient(135deg, #0B8E41, #34E074)'
	},
	{
		name: 'Lavender Red',
		slug: 'lavender-red',
		gradient: 'linear-gradient(135deg, #8237FF, #EF6D7F)'
	},
	{
		name: 'Violet Purple',
		slug: 'violet-purple',
		gradient: 'linear-gradient(135deg, #856BFE, #A997F7)'
	}
];
export const bgTypes = [
	{ label: 'Solid', value: 'solid' },
	{ label: 'Gradient', value: 'gradient' }
];

export const overflows = [
	{ label: __('Default'), value: '' },
	{ label: __('Auto'), value: 'auto' },
	{ label: __('Hidden'), value: 'hidden' },
	{ label: __('Visible'), value: 'visible' },
	{ label: __('Scroll'), value: 'scroll' },
];

export const animationTypes = [
	{ label: __('None'), value: '' },
	{ label: __('Fade Up'), value: 'fade-up' },
	{ label: __('Fade Down'), value: 'fade-down' },
	{ label: __('Fade Left'), value: 'fade-left' },
	{ label: __('Fade Right'), value: 'fade-right' },
	{ label: __('Fade Up Left'), value: 'fade-up-left' },
	{ label: __('Fade Up Right'), value: 'fade-up-right' },
	{ label: __('Fade Down Left'), value: 'fade-down-left' },
	{ label: __('Fade Down Right'), value: 'fade-down-right' },
	{ label: __('Flip Left'), value: 'flip-left' },
	{ label: __('Flip Right'), value: 'flip-right' },
	{ label: __('Flip Up'), value: 'flip-up' },
	{ label: __('Flip Down'), value: 'flip-down' },
	{ label: __('Zoom In'), value: 'zoom-in' },
	{ label: __('Zoom In Up'), value: 'zoom-in-up' },
	{ label: __('Zoom In Down'), value: 'zoom-in-down' },
	{ label: __('Zoom In Left'), value: 'zoom-in-left' },
	{ label: __('Zoom In Right'), value: 'zoom-in-right' },
	{ label: __('Zoom Out'), value: 'zoom-out' },
	{ label: __('Zoom Out Up'), value: 'zoom-out-up' },
	{ label: __('Zoom Out Down'), value: 'zoom-out-down' },
	{ label: __('Zoom Out Right'), value: 'zoom-out-right' },
	{ label: __('Zoom Out Left'), value: 'zoom-out-left' }
];