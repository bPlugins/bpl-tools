import { getAdvBGCSS, getOverlayCSS, getBorderBoxCSS, getPropertyBoxCSS, getMultiShadowCSS } from '../utils/getCSS';
import { deskBreakpoint, tabBreakpoint, mobileBreakpoint } from '../utils/data';

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
	const zIndexCSS = device => zIndex?.[device] ? `z-index: ${zIndex[device]};` : '';

	return {
		desktop: zIndexCSS('desktop') + overflowCSS,
		tablet: zIndexCSS('tablet'),
		mobile: zIndexCSS('mobile')
	};
}
const responsiveCSS = (responsive, isBackend) => {
	const { desktop = false, tablet = false, mobile = false } = responsive || {};

	const css = isBackend ? 'opacity: 0.5;' : 'display: none;';

	const resCSS = val => val ? css : '';

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

export const animationFn = (animation, id) => {
	const element = document.getElementById(id);

	if (element && animation && animation?.type) {
		element.setAttribute('data-aos', animation.type);
		element.setAttribute('data-aos-duration', animation.duration || 0.4);
		element.setAttribute('data-aos-delay', animation.delay || 0);
	}
}

export const generateCSS = (id, advanced, isBackend = false) => {
	const { dimension, background, borderShadow, animation, visibility, responsive, css = '' } = advanced || {};

	const selector = `#${id} > div`;

	!isBackend && animationFn(animation, id);

	const dCSS = dimensionCSS(dimension).desktop + visibilityCSS(visibility).desktop + transitionCSS(background, borderShadow);
	const tCSS = dimensionCSS(dimension).tablet + visibilityCSS(visibility).tablet + responsiveCSS(responsive, isBackend).tablet;
	const mCSS = dimensionCSS(dimension).mobile + visibilityCSS(visibility).mobile + responsiveCSS(responsive, isBackend).mobile;

	const nCSS = borderShadowCSS(borderShadow).normal;
	const hCSS = borderShadowCSS(borderShadow).hover;

	const resCSS = responsiveCSS(responsive, isBackend).desktop;

	return `
		${(dCSS || nCSS) ? `${selector} {
			${dCSS}
			${nCSS}
		}` : ''}
		${(hCSS) ? `${selector}:hover {
			${hCSS}
		}` : ''}

		${resCSS ? `${deskBreakpoint} {
			${selector}{
				${resCSS}
			}
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