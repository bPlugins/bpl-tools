import { useEffect } from 'react';

import { useWPAjax, useWPOptionQuery } from '../../../react-utils/hooks';

const usePremiumInEditor = (utilsAction, pipeAction) => {
	const { data: apbUtils } = useWPOptionQuery(utilsAction);
	const { data = null, refetch, isLoading = true } = useWPAjax(pipeAction, { _wpnonce: apbUtils?.nonce }, true);
	const isPremium = (!isLoading && data?.isPipe) || false;

	useEffect(() => {
		refetch();
	}, [apbUtils]);

	return { isPremium, isLoading };
};
export default usePremiumInEditor;