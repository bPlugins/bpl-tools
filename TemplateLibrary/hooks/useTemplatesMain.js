import { useState, useEffect } from 'react';
import { useWPAjax } from '../../hooks';

const useTemplatesMain = (nonce, type, ajaxAction) => {
	const { data = null, saveData, refetch, isLoading } = useWPAjax(ajaxAction, { _wpnonce: nonce }, false);

	useEffect(() => {
		refetch()
	}, [nonce]);

	useEffect(() => {
		if ('favorites' !== type) {
			saveData({ type })
		}
	}, [type]);

	const [main, setMain] = useState([]);

	useEffect(() => {
		if (data) {
			setMain(data);
		}
	}, [data]);

	return { main, isLoading };
};
export default useTemplatesMain;
