import { useState, useEffect } from 'react';
import { useWPAjax } from '../../hooks';

/**
 * Templates for the current tab, category, page and search.
 *
 * Nothing is fetched until `enabled` is true (the modal is open): every fetch
 * is a catalog request on the pattern library, and the library counts those
 * as someone browsing templates.
 */
const useTemplates = (nonce, type = 'patterns', category = 'all', pageNumber = 1, search = '', ajaxAction, perPage = 9, enabled = true) => {
	const src = search.split(' ').join(',');

	const { data = null, saveData, isLoading } = useWPAjax(ajaxAction, { _wpnonce: nonce, type, category, pageNumber, search: src, perPage }, false);

	const [templates, setTemplates] = useState([]);
	const [totalCount, setTotalCount] = useState(0);

	// Fetch when the modal opens and whenever a filter changes while it is
	// open ('favorites' is a client-side tab).
	useEffect(() => {
		if (enabled && nonce && type && 'favorites' !== type && category !== undefined && pageNumber) {
			saveData({ type, category, pageNumber, search: src, perPage });
		}
	}, [enabled, type, category, pageNumber, search, nonce, perPage]);

	useEffect(() => {
		if (data) {
			setTemplates(data?.patterns || []);
			setTotalCount(parseInt(data?.count) || 0);
		}
	}, [data]);

	return { templates, totalCount, refetchTemplates: saveData, isLoading };
};
export default useTemplates;
