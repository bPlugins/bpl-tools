import { useState, useEffect } from 'react';
import { useWPAjax } from '../../hooks';

const useTemplates = (nonce, type = 'patterns', category = 'all', pageNumber = 1, search = '', ajaxAction, perPage = 12) => {
	const src = search.split(' ').join(',');

	const { data = null, saveData, isLoading } = useWPAjax(ajaxAction, { _wpnonce: nonce, type, category, pageNumber, search: src, perPage }, true);

	const [templates, setTemplates] = useState([]);
	const [totalCount, setTotalCount] = useState([]);

	// Fetch templates when dependencies change
	useEffect(() => {
		if (nonce && type && category !== undefined && pageNumber) {
			saveData({ type, category, pageNumber, search: src, perPage });
		}
	}, [type, category, pageNumber, search, nonce, perPage]);

	useEffect(() => {
		if (data) {
			setTemplates(data?.patterns || []);
			setTotalCount(parseInt(data?.count) || 0);
		}
	}, [data]);

	return { templates, totalCount, refetchTemplates: saveData, isLoading };
};
export default useTemplates;
