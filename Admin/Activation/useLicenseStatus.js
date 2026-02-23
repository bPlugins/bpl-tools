import { useState, useEffect } from 'react';
import useWPAjax from '../../hooks/useWPAjax';

/**
 * Hook to manage license status.
 * 
 * @returns {object} Status state and refetch method
 */
const useLicenseStatus = ({ product_id, licenseActiveNonce }) => {
	const [isActivated, setIsActivated] = useState(false);
	const [activatedLicense, setActivatedLicense] = useState('');

	const { data, isLoading, refetch, error } = useWPAjax(`bpl_${product_id}_get_license_status`, { nonce: licenseActiveNonce });

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
