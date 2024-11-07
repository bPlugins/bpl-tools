import { useEffect } from 'react';

import { useWPAjax, useWPOptionQuery } from './index';

const usePremiumInEditor = (utilsAction, pipeAction) => {
	const { data: utils } = useWPOptionQuery(utilsAction);
	const { data = null, refetch, isLoading = true } = useWPAjax(pipeAction, { _wpnonce: utils?.nonce }, true);
	const isPremium = (!isLoading && data?.isPipe) || false;

	useEffect(() => {
		refetch();
	}, [utils]);

	return { isPremium, isLoading };
};
export default usePremiumInEditor;