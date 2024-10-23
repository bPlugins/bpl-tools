import { mobileBreakpoint, tabBreakpoint } from './data';

export const getBackgroundCSS = (bg, isSolid = true, isGradient = true, isImage = true) => {
	const { type = 'solid', color = '#000000b3', gradient = 'linear-gradient(135deg, #4527a4, #8344c5)', image = {}, position = 'center center', attachment = 'initial', repeat = 'no-repeat', size = 'cover', overlayColor = '#000000b3' } = bg || {};

	const styles = ('gradient' === type && isGradient) ? `background: ${gradient};` :
		('image' === type && isImage) ?
			`background: url(${image?.url});
				background-color: ${overlayColor};
				background-position: ${position};
				background-size: ${size};
				background-repeat: ${repeat};
				background-attachment: ${attachment};
				background-blend-mode: overlay;` :
			isSolid && `background: ${color};`;

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
	};

	if ('object' === typeof border && !Array.isArray(border)) {
		if (border.hasOwnProperty('top') || border.hasOwnProperty('right') || border.hasOwnProperty('bottom') || border.hasOwnProperty('left')) {
			const sides = ['top', 'right', 'bottom', 'left'];
			return sides.map(side =>
				border[side] ? `border-${side}: ${generateBorderCSS(border[side])};` : ''
			).join(' ').trim();
		} else {
			return `border: ${generateBorderCSS(border)};`;
		}
	}

	return '';
}

export const getColorsCSS = (colors) => {
	const { color = '#333', bgType = 'solid', bg = '', gradient = 'linear-gradient(135deg, #4527a4, #8344c5)' } = colors || {};

	const styles = `
		${color ? `color: ${color};` : ''}
		${gradient || bg ? `background: ${'gradient' === bgType ? gradient : bg};` : ''}
	`;

	return styles;
}

export const getIconCSS = (icon, isSize = true, isColor = true) => {
	const { fontSize = 16, colorType = 'solid', color = 'inherit', gradient = 'linear-gradient(135deg, #4527a4, #8344c5)' } = icon || {};

	const colorCSS = 'gradient' === colorType ?
		`color: transparent; background-image: ${gradient}; -webkit-background-clip: text; background-clip: text;` :
		`color: ${color};`;

	const styles = `
		${!fontSize || !isSize ? '' : `font-size: ${fontSize}px;`}
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

	const generateCss = (value, cssProperty) => !value ? '' : `${cssProperty}: ${value};`;

	const isEmptyFamily = !isFamily || !fontFamily || 'Default' === fontFamily;
	const desktopFontSize = fontSize?.desktop || fontSize;
	const tabletFontSize = fontSize?.tablet || desktopFontSize;
	const mobileFontSize = fontSize?.mobile || tabletFontSize;

	const styles = `
		${isEmptyFamily ? '' : `font-family: '${fontFamily}', ${fontCategory};`}
		${generateCss(fontWeight, 'font-weight')}
		${`font-size: ${desktopFontSize}px;`}
		${generateCss(fontStyle, 'font-style')}
		${generateCss(textTransform, 'text-transform')}
		${generateCss(textDecoration, 'text-decoration')}
		${generateCss(lineHeight, 'line-height')}
		${generateCss(letterSpace, 'letter-spacing')}
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
				${`font-size: ${tabletFontSize}px;`}
			}
		}
		${mobileBreakpoint} {
			${selector}{
				${`font-size: ${mobileFontSize}px;`}
			}
		}`.replace(/\s+/g, ' ').trim()
	}
}

export const getBoxCSS = (val) => {
	if (!val) return '0';

	if (typeof val === 'string') return val;

	if (typeof val === 'object' && !Array.isArray(val)) {
		const order = ['top', 'right', 'bottom', 'left'];
		return order.map(side => val[side] || '0').join(' ');
	}

	return '0';
};
export const getPropertyBoxCSS = (property, value) => value ? `${property}: ${getBoxCSS(value)};` : '';

// Murad Wahid
export const getGradientCSS = (gradient) => {
	const { type, radialType, colors, centerPositions, angel } = gradient || {};

	if (gradient) {
		const gradientColors = colors?.map(({ color, position }) => `${color} ${position}%`);
		const liner = `linear-gradient(${angel}deg, ${gradientColors})`;
		const radial = `radial-gradient(${radialType} at ${centerPositions?.x}% ${centerPositions?.y}%,${gradientColors})`;

		return type === 'linear' ? `background: ${liner};` : `background: ${radial};`;
	}
	return '';
};

const getSolidBGCSS = (bg) => `${bg ? `background: ${bg};` : ''}`;

const getImagePosition = (img) => {
	const { position = 'center center', xPosition = 0, yPosition = 0, attachment = '', repeat = 'no-repeat', size = 'cover', customSize = '0px' } = img || {};

	const cd = v => 'initial' !== v;

	return `
		${cd(position) ? `background-position: ${'custom' === position ? `${xPosition} ${yPosition}` : position};` : ''}
		${attachment && cd(attachment) ? `background-attachment: ${attachment};` : ''}
		${cd(repeat) ? `background-repeat: ${repeat};` : ''}
		${cd(size) ? `background-size: ${'custom' === size ? `${customSize} auto` : size};` : ''}
	`;
};
const getImageCSS = (img = {}) => {
	if (img) {
		return {
			desktop: img.url ? `background-image: url(${img.url}); ${getImagePosition(img?.desktop)}` : '',
			tablet: img.url ? getImagePosition(img?.tablet) : '',
			mobile: img.url ? getImagePosition(img?.mobile) : '',
		};
	}
	return '';
};

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
			? getSolidBGCSS(color)
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

		${sl}{
			${bgCSS}
		}

		${tabBreakpoint} {
			${sl}{
				${tablet}
			}
		}
		${mobileBreakpoint} {
			${sl}{
				${mobile}
			}
		}
	`.replace(/\s+/g, ' ').trim()
};

export const getOverlayCSS = (overlay, selector, isHover = false) => {
	const { isEnabled, colors, opacity = 1, blend, filter = '', blur = 0, brightness = 100, contrast = 100, saturation = 100, hue = 0 } = overlay || {};

	const filterCSSValue = `${100 !== brightness ? `brightness(${brightness}%)` : ''} ${100 !== contrast ? `contrast(${contrast}%)` : ''} ${100 !== saturation ? `saturate(${saturation}%)` : ''} ${0 !== blur ? `blur(${blur}px)` : ''} ${0 !== hue ? `hue-rotate(${hue}deg)` : ''}`;
	const filterCSS = `${filter}: ${filter ? filterCSSValue : ''}; -webkit-${filter}: ${filter ? filterCSSValue : ''};`;

	const blendCSS = blend ? `mix-blend-mode: ${blend};` : ''

	const sl = isHover ? `${selector}:hover::after` : `${selector}::after`;

	return isEnabled ? `
		${selector}::after{
			content: '';
			position: absolute;
			inset: 0;
		}
		${getAdvBGCSS(colors, sl, false)}
		${sl}{
			opacity: ${opacity};
			${blendCSS}
			${filterCSS}
		}
	`.replace(/\s+/g, ' ').trim() : ''
};