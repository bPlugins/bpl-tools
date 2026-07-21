import { useState, useEffect } from 'react';

/**
 * Favorite template IDs, persisted in the `{prefix}FavoritesTemplates` option
 * via the `{prefix}_template_favorites` AJAX endpoint.
 *
 * Shape: { patterns: [...ids], pages: [...ids] }
 */
const useFavorites = (nonce, prefix, enabled) => {
	const [favorites, setFavorites] = useState({ patterns: [], pages: [] });
	const [loaded, setLoaded] = useState(false);

	const ajaxAction = `${prefix}_template_favorites`;

	useEffect(() => {
		if (!enabled || !nonce || !prefix || loaded) return;

		wp.ajax
			.post(ajaxAction, { _wpnonce: nonce, prefix })
			.done((res) => {
				setFavorites({ patterns: res?.patterns || [], pages: res?.pages || [] });
				setLoaded(true);
			})
			// eslint-disable-next-line no-console
			.fail((err) => console.error(err));
	}, [enabled, nonce, prefix]);

	const toggleFavorite = (type, id) => {
		const list = favorites[type] || [];
		const next = {
			...favorites,
			[type]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
		};

		setFavorites(next);

		wp.ajax
			.post(ajaxAction, { _wpnonce: nonce, prefix, favorites: JSON.stringify(next) })
			// eslint-disable-next-line no-console
			.fail((err) => console.error(err));
	};

	return { favorites, toggleFavorite };
};
export default useFavorites;
