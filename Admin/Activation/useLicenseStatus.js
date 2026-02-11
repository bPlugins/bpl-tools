import { useState, useEffect } from 'react';
import useWPAjax from '../../hooks/useWPAjax';

/**
 * Hook to manage license status.
 * 
 * @returns {object} Status state and refetch method
 */
const useLicenseStatus = () => {
	const [isActivated, setIsActivated] = useState(false);
	const [activatedLicense, setActivatedLicense] = useState('');

	const nonce = window.apbAdmin?.nonce || '';

	const { data, isLoading, refetch, error } = useWPAjax('get_license_status', { nonce });

	useEffect(() => {
		if (data) {
			setIsActivated(data.is_activated || false);
			if (data.license_key) {
				setActivatedLicense(data.license_key);
			}
		}
	}, [data]);

	return {
		isActivated,
		activatedLicense,
		isLoading,
		error,
		refetch,
		setIsActivated,
		setActivatedLicense
	};
};

export default useLicenseStatus;
