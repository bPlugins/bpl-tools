/**
 * useRenderedBlocks Hook
 *
 * Renders block markup server-side through a plugin REST route (POST { content } → { html, css }), so the editor canvas shows what the frontend shows: dynamic blocks, the layout classes core adds while rendering and the layout CSS it generates for them.
 * Requests are debounced, cached by markup string and never throw; an item stays undefined until it loads (or on error) so the caller can fall back to the raw markup.
 *
 * @param path (required): REST route, e.g. '/bicb/v1/render' (String)
 * @param contents (required): Block markup strings, one per item (Array)
 * @returns { htmls, css }: htmls[i] is the rendered HTML for contents[i] ('' for an empty string), css is the unique CSS of the loaded items joined (Object)
 */

import { useState, useEffect, useRef } from 'react';
import apiFetch from '@wordpress/api-fetch';

const debounceMs = 400;

const useRenderedBlocks = (path, contents = []) => {
	const cache = useRef(new Map()); // content → { html, css }, so an unchanged item never refetches
	const inflight = useRef(new Set()); // A change while a request runs must not start it again
	const latest = useRef(contents);
	const isMounted = useRef(true);
	const [, setLoaded] = useState(0); // Bumped when a response lands so the caller re-renders from the cache

	latest.current = contents;

	// A new array identity every render would restart the debounce, so depend on the strings themselves
	const key = contents.join('\u0000');

	useEffect(() => {
		isMounted.current = true; // Reset too, since StrictMode runs this effect's cleanup and then the effect again

		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		// Typing in the popup updates content on every keystroke, so wait for a pause before rendering
		const timer = setTimeout(() => {
			const pending = [...new Set(contents)].filter(content => content && !cache.current.has(content) && !inflight.current.has(content));

			pending.forEach(content => {
				inflight.current.add(content);

				apiFetch({ path, method: 'POST', data: { content } })
					.then(res => {
						if ('string' !== typeof res?.html) return;

						cache.current.set(content, { html: res.html, css: 'string' === typeof res.css ? res.css : '' });

						// Only re-render for content still on screen; a stale response just warms the cache
						if (isMounted.current && latest.current.includes(content)) {
							setLoaded(count => count + 1);
						}
					})
					.catch(() => {}) // Leave the item undefined; the caller falls back to the raw markup
					.finally(() => inflight.current.delete(content));
			});
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [path, key]);

	const htmls = contents.map(content => content ? cache.current.get(content)?.html : '');
	const css = [...new Set(contents.map(content => cache.current.get(content)?.css).filter(Boolean))].join('\n');

	return { htmls, css };
};
export default useRenderedBlocks;
