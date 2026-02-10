import { useState, useEffect } from 'react';

/**
 * Hook to manage license status, activation, and deactivation.
 * 
 * @param {object} params - Configuration parameters
 * @param {string} params.product_id - Freemius product ID
 * @param {string} params.public_key - Freemius public key
 * @returns {object} License state and methods
 */
const useLicense = ({ product_id, public_key } = {}) => {
    const [isActivated, setIsActivated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activatedLicense, setActivatedLicense] = useState('');

    const ajaxurl = window.apbAdmin?.ajaxurl || '/wp-admin/admin-ajax.php';
    const nonce = window.apbAdmin?.nonce || '';

    // Fetch license status on mount
    const fetchLicenseStatus = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'get_license_status',
                    nonce
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                setIsActivated(data.data.is_activated || false);
                if (data.data.license_key) {
                    setActivatedLicense(data.data.license_key);
                }
            }
        } catch (err) {
            // Silently fail - component will show not activated state
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLicenseStatus();
    }, []);

    // Handle license activation
    const activateLicense = async (licenseKey) => {
        if (!licenseKey.trim()) {
            setError('Please enter a license key');
            return false;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'activate_freemius_license',
                    license_key: licenseKey,
                    product_id: product_id || '',
                    public_key: public_key || '',
                    nonce
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsActivated(true);
                setActivatedLicense(licenseKey);
                return true;
            } else {
                setError(data.data?.message || 'Activation failed. Please check your license key.');
                return false;
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Activation error:', err);
            setError('An error occurred during activation. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle deactivate license
    const deactivateLicense = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(ajaxurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'deactivate_freemius_license',
                    nonce
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsActivated(false);
                setActivatedLicense('');
                return true;
            } else {
                setError(data.data?.message || 'Deactivation failed. Please try again.');
                return false;
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Deactivation error:', err);
            setError('Deactivation error: ' + (err.message || err));
            return false;
        } finally {
            setIsLoading(false);
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
        refetch: fetchLicenseStatus
    };
};

export default useLicense;
