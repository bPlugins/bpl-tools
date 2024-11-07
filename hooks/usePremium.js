import { useWPAjax } from './index';

const usePremium = (pipeAction, nonce) => {
	const { data = null, isLoading } = useWPAjax(pipeAction, { _wpnonce: nonce });
	const isPremium = (!isLoading && data?.isPipe) || false;

	return { isPremium, isLoading };
};
export default usePremium;