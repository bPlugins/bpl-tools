import blob from '../Components/Mask/assets/shapes/blob.svg';
import circle from '../Components/Mask/assets/shapes/circle.svg';
import flower from '../Components/Mask/assets/shapes/flower.svg';
import hexagon from '../Components/Mask/assets/shapes/hexagon.svg';
import sketch from '../Components/Mask/assets/shapes/sketch.svg';
import triangle from '../Components/Mask/assets/shapes/triangle.svg';

import { mobileBreakpoint, tabBreakpoint } from './data';
import { isExist } from './functions';

export const isValidCSS = (p, v) => isExist(v) ? `${p}: ${v};` : '';

export const getBackgroundCSS = (bg, isSolid = true, isGradient = true, isImage = true) => {
	const { type = 'solid', color = '', gradient = '', image = {}, position = '', attachment = '', repeat = '', size = '', overlayColor = '' } = bg || {};

	const styles = ('gradient' === type && isGradient) ? isValidCSS('background', gradient) :
		('image' === type && isImage) ?
			`background: url(${image?.url});
				${isValidCSS('background-color', overlayColor)}
				${isValidCSS('background-position', position)}
				${isValidCSS('background-size', size)}
				${isValidCSS('background-repeat', repeat)}
				${isValidCSS('background-attachment', attachment)}
				${isValidCSS('background-repeat', repeat)}
				background-blend-mode: overlay;` :
			isSolid && isValidCSS('background', color);

	return styles;
} // PHP version in Stepped Content

export const getBorderCSS = (border) => {
	const { width = '0px', style = 'solid', color = '', side = 'all', radius = '0px' } = border || {};

	const borderSideCheck = s => {
		const bSide = side?.toLowerCase();
		return bSide?.includes('all') || bSide?.includes(s);
	}

	const noWidth = width === '0px' || !width;
	const borderCSS = `${width} ${style} ${color}`;

	const styles = `
		${noWidth ? '' : ['top', 'right', 'bottom', 'left'].map(side => borderSideCheck(side) ? `border-${side}: ${borderCSS};` : '').join('')}
		${!radius ? '' : `border-radius: ${radius};`}
	`;

	return styles;
}

export const getBorderBoxCSS = (border) => {
	if (!border) return '';

	const generateBorderCSS = (borderObj) => {
		const { color = '#000000', style = 'solid', width = '0px' } = borderObj;
		return `${width} ${style} ${color}`;
	}

	if ('object' === typeof border && !Array.isArray(border)) {
		if (border.hasOwnProperty('top') || border.hasOwnProperty('right') || border.hasOwnProperty('bottom') || border.hasOwnProperty('left')) {
			const sides = ['top', 'right', 'bottom', 'left'];
			return sides.map(side =>
				border[side] ? `border-${side}: ${generateBorderCSS(border[side])};` : ''
			).join(' ').trim();
		} else {
			return isValidCSS('border', generateBorderCSS(border));
		}
	}

	return '';
}

export const getColorsCSS = (colors) => {
	const { color = '#333', bgType = 'solid', bg = '', gradient = 'linear-gradient(135deg, #4527a4, #8344c5)' } = colors || {};

	const styles = `
		${color ? `color: ${color};` : ''}
		${gradient || bg ? isValidCSS('background', 'gradient' === bgType ? gradient : bg) : ''}
	`;

	return styles;
}

export const getIconCSS = (icon, isSize = true, isColor = true) => {
	const { fontSize = 16, colorType = 'solid', color = 'inherit', gradient = 'linear-gradient(135deg, #4527a4, #8344c5)' } = icon || {};

	const colorCSS = 'gradient' === colorType ?
		`color: transparent; background-image: ${gradient}; -webkit-background-clip: text; background-clip: text;` : isValidCSS('color', color);

	const styles = `
		${!fontSize || !isSize ? '' : isValidCSS('font-size', fontSize ? `${fontSize}px` : '')}
		${isColor ? colorCSS : ''}
	`;

	return styles;
}

export const getMultiShadowCSS = (value, type = 'box') => {
	let styles = '';

	value?.map((item, index) => {
		const { hOffset = '0px', vOffset = '0px', blur = '0px', spreed = '0px', color = '#7090b0', isInset = false } = item || {};

		const inset = isInset ? 'inset' : '';
		const offsetBlur = `${hOffset} ${vOffset} ${blur}`;
		const isComa = index + 1 >= value.length ? '' : ', ';

		styles += 'text' === type ? `${offsetBlur} ${color}${isComa}` : `${offsetBlur} ${spreed} ${color} ${inset}${isComa}`;
	});

	return styles || 'none';
}

export const getSeparatorCSS = (separator) => {
	const { width = '50%', height = '2px', style = 'solid', color = '#bbb' } = separator || {};

	const styles = `
		width: ${width};
		${'0px' === height && '0em' === height && '0rem' === height ? '' : `border-top: ${height} ${style} ${color};`}
	`;

	return styles;
}

export const getShadowCSS = (shadow, type = 'box') => {
	const { hOffset = '0px', vOffset = '0px', blur = '0px', spreed = '0px', color = '#7090b0', isInset = false } = shadow || {};

	const inset = isInset ? 'inset' : '';
	const offsetBlur = `${hOffset} ${vOffset} ${blur}`;

	const styles = 'text' === type ? `${offsetBlur} ${color}` : `${offsetBlur} ${spreed} ${color} ${inset}`;

	return styles || 'none';
}

export const getSpaceCSS = (space) => {
	const { side = 2, vertical = '0px', horizontal = '0px', top = '0px', right = '0px', bottom = '0px', left = '0px' } = space || {};

	const styles = 2 === side ? `${vertical} ${horizontal}` : `${top} ${right} ${bottom} ${left}`;

	return styles;
}

export const getTypoCSS = (selector, typo, isFamily = true) => {
	const { fontFamily = 'Default', fontCategory = 'sans-serif', fontVariant = 400, fontWeight = 400, isUploadFont = true, fontSize = { desktop: 15, tablet: 15, mobile: 15 }, fontStyle = 'normal', textTransform = 'none', textDecoration = 'auto', lineHeight = '135%', letterSpace = '0px' } = typo || {};

	const isEmptyFamily = !isFamily || !fontFamily || 'Default' === fontFamily;
	const desktopFontSize = fontSize?.desktop || fontSize;
	const tabletFontSize = fontSize?.tablet || desktopFontSize;
	const mobileFontSize = fontSize?.mobile || tabletFontSize;

	const styles = `
		${isEmptyFamily ? '' : `font-family: '${fontFamily}', ${fontCategory};`}
		${isValidCSS('font-weight', fontWeight)}
		${isValidCSS('font-size', desktopFontSize ? `${desktopFontSize}px` : '')}
		${isValidCSS('font-style', fontStyle)}
		${isValidCSS('text-transform', textTransform)}
		${isValidCSS('text-decoration', textDecoration)}
		${isValidCSS('line-height', lineHeight)}
		${isValidCSS('letter-spacing', letterSpace)}
	`;

	// Google font link
	const linkQuery = !fontVariant || 400 === fontVariant ? '' : '400i' === fontVariant ? ':ital@1' : fontVariant?.includes('00i') ? `: ital, wght@1, ${fontVariant?.replace('00i', '00')} ` : `: wght@${fontVariant} `;

	const link = isEmptyFamily ? '' : `https://fonts.googleapis.com/css2?family=${fontFamily?.split(' ').join('+')}${linkQuery.replace(/ /g, '')}&display=swap`;

	return {
		googleFontLink: !isUploadFont || isEmptyFamily ? '' : `@import url(${link});`,
		styles: `${selector}{
			${styles}
		}
		${tabBreakpoint} {
			${selector}{
				${isValidCSS('font-size', tabletFontSize ? `${tabletFontSize}px` : '')}
			}
		}
		${mobileBreakpoint} {
			${selector}{
				${isValidCSS('font-size', mobileFontSize ? `${mobileFontSize}px` : '')}
			}
		}`.replace(/\s+/g, ' ').trim()
	}
}

export const getBoxCSS = (val) => {
	if (!val) return '';

	if (typeof val === 'string') return val;

	if (typeof val === 'object' && !Array.isArray(val)) {
		const order = ['top', 'right', 'bottom', 'left'];

		const values = order.map(side => val[side] || '');

		const allEmpty = values.every(value => !value);

		return allEmpty ? '' : order.map(side => val[side] || '0').join(' ');
	}

	return '';
}

// Murad Wahid
export const getGradientCSS = (gradient) => {
	const { type, radialType, colors, centerPositions, angel } = gradient || {};

	if (gradient) {
		const gradientColors = colors?.map(({ color, position }) => `${color} ${position}%`);
		const liner = `linear-gradient(${angel}deg, ${gradientColors})`;
		const radial = `radial-gradient(${radialType} at ${centerPositions?.x}% ${centerPositions?.y}%,${gradientColors})`;

		return isValidCSS('background', type === 'linear' ? liner : radial);
	}
	return '';
}

const getImagePosition = (img) => {
	const { position = 'center center', xPosition = 0, yPosition = 0, attachment = '', repeat = 'no-repeat', size = 'cover', customSize = '0px' } = img || {};

	const cd = v => 'initial' !== v || isExist(v);

	return `
		${cd(position) ? `background-position: ${'custom' === position ? `${xPosition} ${yPosition}` : position};` : ''}
		${attachment && cd(attachment) ? `background-attachment: ${attachment};` : ''}
		${cd(repeat) ? `background-repeat: ${repeat};` : ''}
		${cd(size) ? `background-size: ${'custom' === size ? `${customSize} auto` : size};` : ''}
	`;
}

const getImageCSS = (img = {}) => {
	if (img) {
		return {
			desktop: isExist(img.url) ? `background-image: url(${img.url}); ${getImagePosition(img?.desktop)}` : '',
			tablet: isExist(img.url) ? getImagePosition(img?.tablet) : '',
			mobile: isExist(img.url) ? getImagePosition(img?.mobile) : '',
		}
	}
	return '';
}

const getVideoCSS = (video, selector) => {
	const { url, loop } = video || {};
	const parentEl = document.querySelector(selector);

	const el = parentEl?.querySelector('.bPlVideo');
	const videoEl = document.createElement('video');
	videoEl.muted = true;
	videoEl.autoplay = true;
	videoEl.classList.add('bPlVideo');

	if (!el) {
		if (parentEl && url) {
			videoEl.innerHTML = `<source src=${url}></source>`;
			parentEl.appendChild(videoEl);
		}
	}
	videoEl.loop = loop;
	videoEl.play();

	return `${selector} .bPlVideo{
		left: 0;
		min-height: 100%;
		min-width: 100%;
		position: absolute;
		width: -webkit-fill-available;
		top: 0;
		z-index: 0;
	}`;
}

export const getAdvBGCSS = (background, selector, isHover = false) => {
	const { type = 'color', color, gradient, img, video } = background || {};

	const bgCSS =
		type === 'color'
			? isValidCSS('background', color)
			: type === 'gradient'
				? getGradientCSS(gradient)
				: type === 'image'
					? getImageCSS(img).desktop
					: '';

	const tablet = type === 'image' ? getImageCSS(img).tablet : '';
	const mobile = type === 'image' ? getImageCSS(img).mobile : '';

	const sl = isHover ? `${selector}:hover` : selector;

	return `
		${type === 'video' ? getVideoCSS(video, selector) : ''}

		${bgCSS ? `${sl}{
			${bgCSS}
		}` : ''}

		${tablet ? `${tabBreakpoint} {
			${sl}{
				${tablet}
			}
		}` : ''}

		${mobile ? `${mobileBreakpoint} {
			${sl}{
				${mobile}
			}
		}` : ''}
	`.replace(/\s+/g, ' ').trim()
}

export const getOverlayCSS = (overlay, selector, isHover = false) => {
	const { isEnabled, colors, opacity = 1, blend, filter = '', blur = 0, brightness = 100, contrast = 100, saturation = 100, hue = 0 } = overlay || {};

	const filterCSSValue = `${100 !== brightness ? `brightness(${brightness}%)` : ''} ${100 !== contrast ? `contrast(${contrast}%)` : ''} ${100 !== saturation ? `saturate(${saturation}%)` : ''} ${0 !== blur ? `blur(${blur}px)` : ''} ${0 !== hue ? `hue-rotate(${hue}deg)` : ''}`;
	const filterCSS = `${filter}: ${filter ? filterCSSValue : ''}; -webkit-${filter}: ${filter ? filterCSSValue : ''};`;

	const sl = isHover ? `${selector}:hover::after` : `${selector}::after`;

	return isEnabled ? `
		${selector}::after{
			content: '';
			position: absolute;
			inset: 0;
		}
		${getAdvBGCSS(colors, sl, false)}
		${sl}{
			${isValidCSS('opacity', opacity)}
			${isValidCSS('mix-blend-mode', blend)}
			${filterCSS}
		}
	`.replace(/\s+/g, ' ').trim() : ''
}

export const getTransformCSS = (transform, selector, isHover = false) => {
	const generateTransformCSS = (value, device = 'desktop') => {
		if (!isExist(value)) return '';
		const { skew, scale, rotate, offset, flipX, flipY } = value;
		const { threeDRotate } = rotate || {};
		const { isProportion } = scale || {};
		const transforms = [];
		//skew
		if (isExist(skew)) {
			if (isExist(skew?.[device]?.x)) transforms.push(`skewX(${skew[device].x}deg)`);
			if (isExist(skew?.[device]?.y)) transforms.push(`skewY(${skew[device].y}deg)`);
		}
		//scale
		if (isProportion) {
			if (isExist(scale?.[device]?.scale)) transforms.push(`scale(${scale[device].scale})`);
		} else {
			if (isExist(scale?.[device]?.x)) transforms.push(`scaleX(${scale[device].x})`);
			if (isExist(scale?.[device]?.y)) transforms.push(`scaleY(${scale[device].y})`);
		}

		//rotate
		if (isExist(rotate)) {
			if (isExist(rotate?.[device]?.z)) transforms.push(`rotateZ(${rotate[device].z}deg)`);
			if (threeDRotate) {
				if (isExist(rotate?.[device]?.x)) transforms.push(`rotateX(${rotate[device].x}deg)`);
				if (isExist(rotate?.[device]?.y)) transforms.push(`rotateY(${rotate[device].y}deg)`);
			}
		}

		//offset
		if (isExist(offset)) {
			if (isExist(offset?.[device]?.x)) transforms.push(`translateX(${offset[device].x})`);
			if (isExist(offset?.[device]?.y)) transforms.push(`translateY(${offset[device].y})`);
		}

		//flip
		if (isExist(flipX)) transforms.push(flipX ? 'scaleX(-1)' : '');
		if (isExist(flipY)) transforms.push(flipY ? 'scaleY(-1)' : '');

		if (transforms.length === 0) return '';

		return isValidCSS('transform', transforms.join(' '));
	}

	const sl = isHover ? `${selector}:hover` : selector;
	// ${isExist(hover?.transition)?`transition:transform ${hover.transition}ms ease-in-out`:'' }

	return `
		${sl} {
			${generateTransformCSS(transform, 'desktop')}
		}
		${tabBreakpoint}{
			${sl} {
				${generateTransformCSS(transform, 'tablet')}
			}
		}
		${mobileBreakpoint}{
			${sl} {
				${generateTransformCSS(transform, 'mobile')}
			}
		}
	`;
}

export const getMaskCSS = (mask) => {
	const { isMask = false, shape = { type: 'circle' }, size = { type: 'contain', scale: '100%' }, position = { type: 'center center', x: 50, y: 50 }, repeat = 'no-repeat' } = mask || {};

	const svgShape = [{ svg: circle, type: 'circle' }, { svg: flower, type: 'flower' }, { svg: sketch, type: 'sketch' }, { svg: triangle, type: 'triangle' }, { svg: blob, type: 'blob' }, { svg: hexagon, type: 'hexagon' },];

	const getShape = (type) => svgShape.find((e) => e.type === type);
	return isMask ?
		`-webkit-mask-image: url(${shape.type === 'custom' ? shape.url : getShape(shape.type).svg});
		-webkit-mask-size: ${size.type === 'custom' ? size.scale : size.type};
		${position.type === 'custom' ?
			`${isValidCSS('-webkit-mask-position-x', position.x)}
			${isValidCSS('-webkit-mask-position-y', position.y)}` :
			`${isValidCSS('-webkit-mask-position', position.type)}`
		}
		${size.type !== 'cover' ? `-webkit-mask-repeat: ${repeat};` : ''}` :
		'';
}