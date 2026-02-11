import { useState, useEffect } from 'react';

import useLicenseStatus from './useLicenseStatus';
import useActivateLicense from './useActivateLicense';
import useDeactivateLicense from './useDeactivateLicense';

/**
 * Hook to manage license status, activation, and deactivation.
 * Consolidates specialized hooks into a single interface.
 * 
 * @param {object} params - Configuration parameters
 * @returns {object} License state and methods
 */
const useLicense = (params = {}) => {
	const {
		isActivated,
		activatedLicense,
		isLoading: isStatusLoading,
		error: statusError,
		refetch: refetchStatus,
		setIsActivated,
		setActivatedLicense
	} = useLicenseStatus();

	const {
		activateLicense: performActivation,
		isLoading: isActivating,
		error: activationError
	} = useActivateLicense(params);

	const {
		deactivateLicense: performDeactivation,
		isLoading: isDeactivating,
		error: deactivationError
	} = useDeactivateLicense();

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	// Sync local isLoading
	useEffect(() => {
		setIsLoading(isStatusLoading || isActivating || isDeactivating);
	}, [isStatusLoading, isActivating, isDeactivating]);

	// Sync local error
	useEffect(() => {
		const rawError = statusError || activationError || deactivationError;
		if (rawError) {
			const normalizedError = rawError?.message || (typeof rawError === 'string' ? rawError : 'An error occurred');
			setError(normalizedError);
		} else {
			setError('');
		}
	}, [statusError, activationError, deactivationError]);

	const activateLicense = async (licenseKey) => {
		try {
			await performActivation(licenseKey);
			setIsActivated(true);
			setActivatedLicense(licenseKey);
			return true;
		} catch (err) {
			return false;
		}
	};

	const deactivateLicense = async () => {
		try {
			await performDeactivation();
			setIsActivated(false);
			setActivatedLicense('');
			return true;
		} catch (err) {
			return false;
		}
	};

	return {
		isActivated,
		isLoading,
		error,
		activatedLicense,
		activateLicense,
		deactivateLicense,
		setError,
		refetch: refetchStatus
	};
};
export default useLicense;
