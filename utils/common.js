export const isExist = (value) => {
	if (value === undefined || value === null || value === '') {
		return false;
	}
	if (Array.isArray(value) && value.length === 0) {
		return false;
	}
	if (typeof value === 'object' && Object.keys(value).length === 0) {
		return false;
	}
	if (typeof value === 'string' && value.trim() === '') {
		return false;
	}
	if (typeof value === 'number' && value === 0) {
		return false;
	}
	return true;
}

export const escapeHTML = (input = '') => {
	if (!input) {
		return '';
	}

	// Regular expression to match all HTML tags and their attributes
	return input?.replace(/<([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, tagName, attrs) => {
		// List of allowed tags and their attributes
		const allowedTags = ['b', 'strong', 'i', 'em', 'span', 'a', 'br'];
		const allowedAttrs = ['style', 'href', 'target', 'rel', 'class'];

		// If the tag is allowed, keep it, but sanitize its attributes
		if (allowedTags.includes(tagName.toLowerCase())) {
			// Process the tag's attributes
			const sanitizedAttrs = attrs.replace(/([a-z0-9-]+)=["'][^"']*["']/gi, (attrMatch, attrName) => {
				// Only keep allowed attributes
				if (allowedAttrs.includes(attrName.toLowerCase())) {
					return attrMatch; // Keep allowed attributes as they are
				}
				return ''; // Remove any other attributes
			});

			return `<${tagName}${sanitizedAttrs}>`;
		}

		return match?.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	});
}

export const sanitizeURL = (inputUrl) => {
	try {
		const url = new URL(inputUrl);

		// 1. Check for safe protocols
		if (!['http:', 'https:'].includes(url.protocol)) {
			return null;
		} else {
			// 2. Strip query and fragment for safety
			// url.search = '';
			// url.hash = '';

			return url.toString();
		}
	} catch (err) {
		if (typeof inputUrl === 'string' && inputUrl.startsWith('/') && !inputUrl.startsWith('//')) {
			return inputUrl;
		} else {
			return null;
		}
	}
}

export const sanitizeHTML = input => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(input, 'text/html');

	const allowedTags = ['b', 'strong', 'i', 'em', 'span', 'a', 'br'];
	const allowedAttrs = ['style', 'href', 'target', 'rel', 'class'];

	doc.body.querySelectorAll('*').forEach((node) => {
		// Remove disallowed tags
		if (!allowedTags.includes(node.tagName.toLowerCase())) {
			node.remove();
			return;
		}

		// Loop through attributes and sanitize
		[...node.attributes].forEach(attr => {
			if (!allowedAttrs.includes(attr.name)) {
				node.removeAttribute(attr.name);
			}

			// if (attr.name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) {
			// 	node.removeAttribute('href');
			// }

			if (attr.name === 'href') {
				const sanitizeHref = sanitizeURL(attr.value);

				if (sanitizeHref) {
					node.setAttribute('href', sanitizeHref)
				} else {
					node.removeAttribute('href');
				}
			}
		});
	});

	return doc.body.innerHTML;
}

export const sanitizeInput = (input) => {
	return input.replace(/[<>]/g, '').replace(/javascript:/gi, '').replace(/on\w+=/gi, '').trim();
};

//-------- Sanitize SVG ----------//
export class SVGSanitizer {
	constructor(options = {}) {
		this.defaultOptions = {
			allowedTags: [
				'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline',
				'polygon', 'text', 'tspan', 'defs', 'clipPath', 'mask', 'linearGradient',
				'radialGradient', 'stop', 'style', 'title', 'desc'
			],
			allowedAttributes: [
				// Core
				'id', 'class', 'style', 'transform', 'xmlns', 'xmlns:xlink', 'version',
				'baseProfile', 'xml:space',
				// Geometry
				'd', 'x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry', 'points',
				'x1', 'y1', 'x2', 'y2', 'viewBox', 'preserveAspectRatio', 'overflow',
				// Paint
				'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width',
				'stroke-linecap', 'stroke-linejoin', 'stroke-opacity', 'stroke-dasharray',
				'stroke-dashoffset', 'stroke-miterlimit', 'opacity', 'color',
				'paint-order', 'vector-effect', 'shape-rendering', 'display', 'visibility',
				// Clipping and masking
				'clip-path', 'clip-rule', 'clipPathUnits', 'mask', 'maskUnits',
				'maskContentUnits',
				// Gradients
				'offset', 'stop-color', 'stop-opacity', 'gradientUnits',
				'gradientTransform', 'spreadMethod', 'fx', 'fy', 'fr',
				// Text
				'dx', 'dy', 'text-anchor', 'dominant-baseline', 'alignment-baseline',
				'font-family', 'font-size', 'font-style', 'font-weight',
				'letter-spacing', 'word-spacing', 'textLength', 'lengthAdjust',
				// Accessibility
				'role', 'focusable', 'aria-hidden', 'aria-label', 'aria-labelledby',
				'aria-describedby'
			],
			allowedProtocols: ['http', 'https', 'data'],
			removeScripts: true,
			removeEvents: true,
			removeExternalResources: true,
			sanitizeStyle: true
		};

		this.options = { ...this.defaultOptions, ...options };

		// The markup is parsed as XML, which is case sensitive, but the markup this
		// output is injected into (innerHTML) is not. Names are therefore matched
		// lower-cased, so `onLoad` is caught the same way `onload` is - it would
		// otherwise survive here and turn back into a live handler in the page.
		this.allowedTagSet = new Set(this.options.allowedTags.map(tag => tag.toLowerCase()));
		this.allowedAttributeSet = new Set(this.options.allowedAttributes.map(attr => attr.toLowerCase()));
	}

	sanitize(svgString) {
		if ('string' !== typeof svgString || '' === svgString.trim()) {
			return '';
		}

		const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
		const root = doc.documentElement;

		// Malformed markup does not throw: the parser hands back a <parsererror>
		// tree, which would otherwise be serialised straight into the page.
		if (!root || 'svg' !== root.localName.toLowerCase() || doc.getElementsByTagName('parsererror').length) {
			return '';
		}

		this.removeScripts(doc);
		this.sanitizeElements(doc);

		return new XMLSerializer().serializeToString(doc.documentElement);
	}

	// Sanitize from a File object / URL
	async sanitizeFile(file) {
		const response = await fetch(file);
		const svgText = await response.text();

		return this.sanitize(`${svgText}`);
	}

	removeScripts(doc) {
		if (!this.options.removeScripts) {
			return;
		}

		Array.from(doc.querySelectorAll('*')).forEach(element => {
			if (element.localName.toLowerCase().includes('script')) {
				element.remove();
			}
		});
	}

	sanitizeElements(doc) {
		Array.from(doc.querySelectorAll('*')).forEach(element => {
			const tagName = element.localName.toLowerCase();

			if (!this.allowedTagSet.has(tagName)) {
				element.remove();
				return;
			}

			// A <style> element's CSS is never seen by sanitizeAttributes().
			if ('style' === tagName && this.options.sanitizeStyle) {
				element.textContent = this.sanitizeCss(element.textContent);
			}

			this.sanitizeAttributes(element);
		});
	}

	sanitizeAttributes(element) {
		Array.from(element.attributes).forEach(attr => {
			// The case-preserved name: removeAttribute() is case sensitive on an XML
			// document, so removing by a lower-cased name silently does nothing.
			const name = attr.name;
			const lowerName = name.toLowerCase();
			const value = attr.value;

			if (this.options.removeEvents && lowerName.startsWith('on')) {
				element.removeAttribute(name);
				return;
			}

			if (this.options.removeExternalResources && ('href' === lowerName || lowerName.endsWith(':href')) && !this.isAllowedUrl(value)) {
				element.removeAttribute(name);
				return;
			}

			const baseName = lowerName.replace('xlink:', '');
			if (!this.allowedAttributeSet.has(lowerName) && !this.allowedAttributeSet.has(baseName)) {
				element.removeAttribute(name);
				return;
			}

			// url() may only reference a fragment of this same document; anything
			// else - fill, clip-path, mask, style - is an external reference.
			if (this.options.removeExternalResources && this.hasExternalUrl(value)) {
				element.removeAttribute(name);
				return;
			}

			if ('style' === lowerName && this.options.sanitizeStyle) {
				element.setAttribute(name, this.sanitizeCss(value));
			}
		});
	}

	hasExternalUrl(value) {
		if ('string' !== typeof value || !/url\s*\(/i.test(value)) {
			return false;
		}

		return Array.from(value.matchAll(/url\s*\(\s*['"]?([^'")]*)/gi))
			.some(([, target]) => !target.trim().startsWith('#'));
	}

	isAllowedUrl(url) {
		const value = String(url || '').trim();

		if (value.startsWith('#')) {
			return true;
		}

		if (/^data:/i.test(value)) {
			// Inline images only - never data:text/html and friends.
			return this.options.allowedProtocols.includes('data') && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value);
		}

		try {
			return this.options.allowedProtocols.includes(new URL(value).protocol.replace(':', ''));
		} catch {
			return false;
		}
	}

	sanitizeCss(css) {
		return String(css || '')
			.replace(/expression\s*\(/gi, '')
			.replace(/javascript:/gi, '')
			.replace(/behavior\s*:/gi, '')
			.replace(/binding\s*:/gi, '')
			.replace(/@import[^;]*;?/gi, '')
			.replace(/url\s*\(\s*(['"]?)(?!#)[^)]*\)/gi, 'none');
	}
}

// Shared instance: rebuilding the allow lists on every render is wasted work,
// and a render sink can run this hundreds of times on one page. Memoise the
// result at the call site (useMemo on the raw markup) rather than re-sanitizing.
export const svgSanitizer = new SVGSanitizer();

export const sanitizeSVG = (svg) => svgSanitizer.sanitize(svg);