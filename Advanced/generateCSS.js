import { getAdvBGCSS, getOverlayCSS, getBorderBoxCSS, getPropertyBoxCSS, getMultiShadowCSS } from '../utils/getCSS';
import { tabBreakpoint, mobileBreakpoint } from '../utils/data';

const dimensionCSS = (dimension) => {
	const { padding, margin } = dimension || {};

	const pCSS = (p) => getPropertyBoxCSS('padding', p);
	const mCSS = (m) => getPropertyBoxCSS('margin', m);

	return {
		desktop: pCSS(padding?.desktop) + mCSS(margin?.desktop),

		tablet: pCSS(padding?.tablet) + mCSS(margin?.tablet),

		mobile: pCSS(padding?.mobile) + mCSS(margin?.mobile)
	};
}
const borderShadowCSS = (borderShadow) => {
	const { normal, hover } = borderShadow || {};

	const stateGenerate = (state) => {
		const { border, radius, shadow } = state || {};

		const radiusCSS = radius ? getPropertyBoxCSS('border-radius', radius) : '';
		const shadowCSS = shadow ? `box-shadow: ${getMultiShadowCSS(shadow)};` : '';

		return getBorderBoxCSS(border) + radiusCSS + shadowCSS;
	};

	return {
		normal: stateGenerate(normal),
		hover: stateGenerate(hover)
	};
}
const visibilityCSS = (visibility) => {
	const { zIndex, overflow } = visibility || {};

	const overflowCSS = overflow ? `overflow: ${overflow};` : '';
	const zIndexCSS = device => zIndex?.[device] ? `z-index: ${zIndex[device]}` : '';

	return {
		desktop: zIndexCSS('desktop') + overflowCSS,
		tablet: zIndexCSS('tablet'),
		mobile: zIndexCSS('mobile')
	};
}
const responsiveCSS = (responsive) => {
	const { desktop = false, tablet = false, mobile = false } = responsive || {};

	const resCSS = val => val ? `display: none;` : '';

	return {
		desktop: resCSS(desktop),
		tablet: resCSS(tablet),
		mobile: resCSS(mobile)
	};
}

const transitionCSS = (background, borderShadow) => {
	const { transition: bgT = 0.4 } = background || {};
	const { transition: bsT = 0.4 } = borderShadow || {};

	return `transition: background ${bgT}s, border ${bsT}s, border-radius ${bsT}s, box-shadow ${bsT}s;`
}

export const generateCSS = (id, advanced) => {
	const { dimension, background, borderShadow, visibility, responsive, css = '' } = advanced || {};

	const selector = `#${id}`;

	const dCSS = dimensionCSS(dimension).desktop + visibilityCSS(visibility).desktop + responsiveCSS(responsive).desktop + transitionCSS(background, borderShadow);
	const tCSS = dimensionCSS(dimension).tablet + visibilityCSS(visibility).tablet + responsiveCSS(responsive).tablet;
	const mCSS = dimensionCSS(dimension).mobile + visibilityCSS(visibility).mobile + responsiveCSS(responsive).mobile;

	const nCSS = borderShadowCSS(borderShadow).normal;
	const hCSS = borderShadowCSS(borderShadow).hover;

	return `
		${(dCSS || nCSS) ? `${selector} {
			${dCSS}
			${nCSS}
		}` : ''}
		${(hCSS) ? `${selector}:hover {
			${hCSS}
		}` : ''}

		${tCSS ? `${tabBreakpoint} {
			${selector}{
				${tCSS}
			}
		}` : ''}

		${mCSS ? `${mobileBreakpoint} {
			${selector}{
				${mCSS}
			}
		}` : ''}

		${getAdvBGCSS(background?.normal, selector)}
		${getAdvBGCSS(background?.hover, selector, true)}
		${getOverlayCSS(background?.overlay, selector)}
		${getOverlayCSS(background?.hoverOverlay, selector, true)}

		${css}
	`.replace(/\s+/g, ' ');
}
export default generateCSS;