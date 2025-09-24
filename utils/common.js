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
				'id', 'class', 'style', 'transform', 'd', 'x', 'y', 'width', 'height',
				'cx', 'cy', 'r', 'rx', 'ry', 'points', 'x1', 'y1', 'x2', 'y2',
				'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
				'opacity', 'fill-opacity', 'stroke-opacity', 'viewBox', 'preserveAspectRatio',
				'xmlns', 'xmlns:xlink'
			],
			allowedProtocols: ['http', 'https', 'data'],
			removeScripts: true,
			removeEvents: true,
			removeExternalResources: true,
			sanitizeStyle: true
		};

		this.options = { ...this.defaultOptions, ...options };
	}

	sanitize(svgString) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, 'image/svg+xml');

		this.removeScripts(doc);
		this.sanitizeElements(doc);

		const serializer = new XMLSerializer();
		return serializer.serializeToString(doc.documentElement);
	}

	// ✅ New method: sanitize from File object
	async sanitizeFile(file) {
		const response = await fetch(file);
		const svgText = await response.text();
		// console.log(svgText)
		return this.sanitize(`${svgText}`);
		// return "";
	}

	removeScripts(doc) {
		if (this.options.removeScripts) {
			const scripts = doc.querySelectorAll('script');
			scripts.forEach(script => script.remove());

			const allElements = doc.querySelectorAll('*');
			allElements.forEach(el => {
				if (el.tagName.toLowerCase().includes('script')) {
					el.remove();
				}
			});
		}
	}

	sanitizeElements(doc) {
		const allElements = doc.querySelectorAll('*');

		allElements.forEach(element => {
			const tagName = element.tagName.toLowerCase();

			if (!this.options.allowedTags.includes(tagName)) {
				element.remove();
				return;
			}

			this.sanitizeAttributes(element);
		});
	}

	sanitizeAttributes(element) {
		const attributes = Array.from(element.attributes);

		attributes.forEach(attr => {
			const attrName = attr.name.toLowerCase();
			const attrValue = attr.value;

			if (this.options.removeEvents && attrName.startsWith('on')) {
				element.removeAttribute(attrName);
				return;
			}

			if (this.options.removeExternalResources) {
				if ((attrName === 'href' || attrName === 'xlink:href') &&
					!this.isAllowedUrl(attrValue)) {
					element.removeAttribute(attrName);
					return;
				}
			}

			const baseAttrName = attrName.replace('xlink:', '');
			if (!this.options.allowedAttributes.includes(baseAttrName)) {
				element.removeAttribute(attrName);
				return;
			}

			if (attrName === 'style' && this.options.sanitizeStyle) {
				this.sanitizeStyleAttribute(element, attrValue);
			}
		});
	}

	isAllowedUrl(url) {
		if (url.startsWith('data:') || url.startsWith('#')) {
			return true;
		}

		try {
			const parsedUrl = new URL(url);
			return this.options.allowedProtocols.includes(parsedUrl.protocol.replace(':', ''));
		} catch {
			return false;
		}
	}

	sanitizeStyleAttribute(element, styleValue) {
		const safeStyle = styleValue
			.replace(/expression\(|javascript:|url\(javascript:/gi, '')
			.replace(/behavior\s*:/gi, '')
			.replace(/binding\s*:/gi, '');

		element.setAttribute('style', safeStyle);
	}
}