import { getAdvBGCSS, getBoxCSS } from '../utils/getCSS';

const dimensionCSS = (dimension) => {
	const { padding, margin } = dimension || {};

	const pCSS = (p) => p ? `padding: ${getBoxCSS(p)};` : '';
	const mCSS = (m) => m ? `margin: ${getBoxCSS(m)};` : '';

	return {
		desktop: pCSS(padding?.desktop) + mCSS(margin?.desktop),

		tablet: pCSS(padding?.tablet) + mCSS(margin?.tablet),

		mobile: pCSS(padding?.mobile) + mCSS(margin?.mobile)
	};
}

export const generateCSS = (id, advanced) => {
	const { dimension, background } = advanced || {};

	const dCSS = dimensionCSS(dimension).desktop;
	const tCSS = dimensionCSS(dimension).tablet;
	const mCSS = dimensionCSS(dimension).mobile;

	return `
		${dCSS ? `#${id} {
			${dCSS}
			${background?.transition ? `transition all ${background?.transition} ease;` : ''}
		}` : ''}

		${tCSS ? `@media only screen and (min-width:641px) and (max-width: 1024px) {
			#${id}{
				${tCSS}
			}
		}` : ''}

		${mCSS ? `@media only screen and (max-width: 640px) {
			#${id}{
				${mCSS}
			}
		}` : ''}

		${getAdvBGCSS(background?.normal, `#${id}`)}
		${getAdvBGCSS(background?.hover, `#${id}`, true)}
	`.replace(/\s+/g, ' ');
}
export default generateCSS;