import { useState, useEffect } from 'react';

// Accurate Free/Pro counts per category, computed server-side from the full
// catalog. Fetched once the modal is open, per type; the server caches it
// so repeat opens are instant.
//
// Shape: { all, free, pro, categories: { <cat>: { total, free, pro } } }
const useAccessCounts = (nonce, type, enabled, ajaxAction) => {
	const [counts, setCounts] = useState(null);

	useEffect(() => {
		if (!enabled || !nonce) {
			return undefined;
		}

		let cancelled = false;
		setCounts(null);

		wp.ajax
			.post(ajaxAction, { _wpnonce: nonce, type })
			.done((res) => { if (!cancelled) setCounts(res); })
			// eslint-disable-next-line no-console
			.fail((err) => console.error(err));

		return () => { cancelled = true; };
	}, [nonce, type, enabled, ajaxAction]);

	return counts;
};

export default useAccessCounts;
