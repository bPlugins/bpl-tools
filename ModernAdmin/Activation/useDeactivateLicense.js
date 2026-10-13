import { useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Hook to manage license deactivation.
 * 
 * @returns {object} Deactivation methods and state
 */
const useDeactivateLicense = ({ product_id, licenseActiveNonce }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const deactivateLicense = () => {
		setIsLoading(true);
		setError(null);

		return new Promise((resolve, reject) => {
			wp.ajax.post(`bpl_${product_id}_deactivate_license`, { nonce: licenseActiveNonce })
				.done((res) => {
					setIsLoading(false);
					resolve(res);
				})
				.fail((err) => {
					setIsLoading(false);
					const message = err?.message || __('Deactivation failed');
					setError(message);
					reject(err);
				});
		});
	};

	return {
		deactivateLicense,
		isLoading,
		error
	};
};

export default useDeactivateLicense;
