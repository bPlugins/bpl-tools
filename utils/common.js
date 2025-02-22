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