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
					return attrMatch;  // Keep allowed attributes as they are
				}
				return '';  // Remove any other attributes
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

			// if (attr.name === "href" && attr.value.trim().toLowerCase().startsWith("javascript:")) {
			// 	node.removeAttribute("href");
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