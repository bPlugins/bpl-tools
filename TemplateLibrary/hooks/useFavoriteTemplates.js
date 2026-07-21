import { useState, useEffect, useMemo } from 'react';

/**
 * Resolves the full template objects for the favorited IDs.
 *
 * The catalog endpoint has no by-ID lookup, so each type is fetched once (up
 * to 100 items) and matched against the favorite IDs. Results are cached, so:
 *	- un-favoriting drops an item instantly (client-side filter, no request)
 *	- re-favoriting a previously seen item is free (cache hit)
 *	- a request only fires when a favorite ID hasn't been fetched yet
 *
 * Each item is tagged with `__type` so mixed patterns/pages render correctly.
 */
const useFavoriteTemplates = (nonce, ajaxAction, favorites, enabled) => {
	const [cache, setCache] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!enabled || !nonce) return undefined;

		const have = new Set(cache.map((i) => `${i.__type}-${i.ID}`));
		const missing = ['patterns', 'pages'].some((t) =>
			(favorites[t] || []).some((id) => !have.has(`${t}-${id}`)));

		if (!missing) return undefined;

		const types = ['patterns', 'pages'].filter((t) => favorites[t]?.length);

		let cancelled = false;
		setIsLoading(true);

		Promise.all(types.map((t) => new Promise((resolve) => {
			wp.ajax
				.post(ajaxAction, { _wpnonce: nonce, type: t, category: 'all', pageNumber: 1, perPage: 100, search: '' })
				.done((res) => resolve((res?.patterns || []).map((item) => ({ ...item, __type: t }))))
				.fail(() => resolve([]));
		}))).then((lists) => {
			if (cancelled) return;

			setCache((prev) => {
				const seen = new Set(prev.map((i) => `${i.__type}-${i.ID}`));
				const merged = [...prev];
				lists.flat().forEach((i) => {
					const key = `${i.__type}-${i.ID}`;
					if (!seen.has(key)) {
						seen.add(key);
						merged.push(i);
					}
				});
				return merged;
			});
			setIsLoading(false);
		});

		return () => { cancelled = true; };
	}, [enabled, nonce, favorites]);

	// Expose only the currently-favorited items (drops unfavorited ones instantly)
	const favTemplates = useMemo(
		() => cache.filter((i) => (favorites[i.__type] || []).includes(i.ID)),
		[cache, favorites]
	);

	return { favTemplates, isLoading };
};
export default useFavoriteTemplates;
