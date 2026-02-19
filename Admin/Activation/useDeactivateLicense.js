import { useState } from 'react';

/**
 * Hook to manage license deactivation.
 * 
 * @returns {object} Deactivation methods and state
 */
const useDeactivateLicense = ({ licenseActiveNonce }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const deactivateLicense = () => {
		setIsLoading(true);
		setError(null);

		return new Promise((resolve, reject) => {
			wp.ajax.post('deactivate_freemius_license', { nonce: licenseActiveNonce })
				.done((res) => {
					setIsLoading(false);
					resolve(res);
				})
				.fail((err) => {
					setIsLoading(false);
					const message = err?.message || 'Deactivation failed';
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
