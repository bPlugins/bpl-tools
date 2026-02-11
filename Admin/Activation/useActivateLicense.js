import { useState } from 'react';

/**
 * Hook to manage license activation.
 * 
 * @param {object} params - Configuration parameters
 * @param {string} params.product_id - Freemius product ID
 * @param {string} params.public_key - Freemius public key
 * @returns {object} Activation methods and state
 */
const useActivateLicense = ({ product_id, public_key } = {}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const nonce = window.apbAdmin?.nonce || '';

	const activateLicense = (licenseKey) => {
		if (!licenseKey.trim()) {
			return Promise.reject(new Error('Please enter a license key'));
		}

		setIsLoading(true);
		setError(null);

		return new Promise((resolve, reject) => {
			wp.ajax.post('activate_freemius_license', {
				license_key: licenseKey,
				product_id: product_id || '',
				public_key: public_key || '',
				nonce
			})
				.done((res) => {
					setIsLoading(false);
					resolve(res);
				})
				.fail((err) => {
					setIsLoading(false);
					const message = err?.message || 'Activation failed';
					setError(message);
					reject(err);
				});
		});
	};

	return {
		activateLicense,
		isLoading,
		error
	};
};

export default useActivateLicense;
