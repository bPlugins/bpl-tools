import { isExist } from '../utils/common';
import { deskBreakpoint, mobileBreakpoint, tabBreakpoint } from '../utils/data';
import { getAdvBGCSS, getBorderBoxCSS, getBoxCSS, getMaskCSS, getMultiShadowCSS, getOverlayCSS, getTransformCSS, isValidCSS } from '../utils/getCSS';

const dimensionCSS = (dimension) => {
	const { padding, margin, height, width } = dimension || {};

	const hwCSS = (p, v) => isValidCSS(p, v);

	const heightWidthCSS = (type, obj, d) => hwCSS(type, obj?.[type]?.[d]) + hwCSS(`min-${type}`, obj?.min?.[d]) + hwCSS(`max-${type}`, obj?.max?.[d]);

	const pCSS = (p) => isValidCSS('padding', getBoxCSS(p));
	const mCSS = (m) => isValidCSS('margin', getBoxCSS(m));

	return {
		desktop: pCSS(padding?.desktop) + mCSS(margin?.desktop) + heightWidthCSS('height', height, 'desktop') + heightWidthCSS('width', width, 'desktop'),

		tablet: pCSS(padding?.tablet) + mCSS(margin?.tablet) + heightWidthCSS('height', height, 'tablet') + heightWidthCSS('width', width, 'tablet'),

		mobile: pCSS(padding?.mobile) + mCSS(margin?.mobile) + heightWidthCSS('height', height, 'mobile') + heightWidthCSS('width', width, 'mobile')
	}
}

const borderShadowCSS = (borderShadow) => {
	const { normal, hover } = borderShadow || {};

	const stateGenerate = (state) => {
		const { border, radius, shadow } = state || {};

		const radiusCSS = isValidCSS('border-radius', getBoxCSS(radius));
		const shadowCSS = isValidCSS('box-shadow', getMultiShadowCSS(shadow, 'box'));

		return getBorderBoxCSS(border) + radiusCSS + shadowCSS;
	}

	return {
		normal: stateGenerate(normal),
		hover: stateGenerate(hover)
	}
}
const visibilityCSS = (visibility) => {
	const { zIndex, overflow } = visibility || {};

	const overflowCSS = overflow ? `overflow: ${overflow};` : '';
	const zIndexCSS = device => `${isValidCSS('z-index', zIndex[device])} ${isValidCSS('position', isExist(zIndex[device]) ? 'relative' : '')}`;

	return {
		desktop: zIndexCSS('desktop') + overflowCSS,
		tablet: zIndexCSS('tablet'),
		mobile: zIndexCSS('mobile')
	}
}
const responsiveCSS = (responsive, isBackend) => {
	const { desktop = false, tablet = false, mobile = false } = responsive || {};

	const css = isBackend ? 'opacity: 0.5;' : 'display: none;';

	const resCSS = val => val ? css : '';

	return {
		desktop: resCSS(desktop),
		tablet: resCSS(tablet),
		mobile: resCSS(mobile)
	}
}

const transitionCSS = (background, borderShadow, transform) => {
	const { transition: bgT = 0.4 } = background || {};
	const { transition: bsT = 0.4 } = borderShadow || {};
	const { transition: tfT = 200 } = transform || {};

	return `transition: background ${bgT}s, border ${bsT}s, border-radius ${bsT}s, box-shadow ${bsT}s, transform ${tfT}ms ease-in-out;`
}

// export const animationFn = (animation, id,isBackend) => {
// 	const selector = isBackend?`#${id} > div`:`$#${id}`;
// 	const element = document.querySelector(selector);
// 	if (element && animation && animation?.type) {
// 		element.setAttribute('data-aos', animation.type);
// 		element.setAttribute('data-aos-duration', animation.duration || 0.4);
// 		element.setAttribute('data-aos-delay', animation.delay || 0);
// 	}
// }
export const animationFn = (animation, id, isBackend) => {
	const selector = isBackend ? `#${id} > div` : `#${id}`;
	const element = document.querySelector(selector);
	if (element && animation && animation.type) {

		element.setAttribute('data-aos', animation.type);
		element.setAttribute('data-aos-duration', animation.duration * 1000 || 0.4);
		element.setAttribute('data-aos-delay', animation.delay * 1000 || 0);

		if (!element.classList.contains('aos-init')) {
			element.classList.add('aos-init');
			window?.AOS?.init();
		}

		if (isBackend) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.intersectionRatio > 0.5) {
						element.classList.add('aos-animate');
					} else { element.classList.remove('aos-animate'); }
				});
			}, { threshold: [0.5] });

			observer.observe(element);
		}

	}
};

export const generateCSS = (id, advanced, isBackend = false) => {
	const { dimension, transform, background, borderShadow, mask, animation, visibility, responsive, css = '' } = advanced || {};

	const selector = isBackend ? `#${id} > div > div:first-child` : `#${id} > div`;

	// !isBackend && animationFn(animation, id);
	animationFn(animation, id, isBackend);

	const dCSS = dimensionCSS(dimension).desktop + visibilityCSS(visibility).desktop + transitionCSS(background, borderShadow, transform) + getMaskCSS(mask);
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
		${isExist(transform?.normal) ? getTransformCSS(transform?.normal, selector) : ''}
		${isExist(transform?.hover) ? getTransformCSS(transform?.hover, selector, true) : ''}

		${css}
	`.replace(/\s+/g, ' ');
}
export default generateCSS;