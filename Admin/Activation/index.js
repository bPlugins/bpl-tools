import { useState, useEffect } from 'react';
import { Spinner, Tooltip } from '@wordpress/components';

import './style.scss';

import Button from '../../Components/Button/Button';
import { linkIcon, pluginIcon, questionIcon } from '../../utils/icons';

/**
 * License Activation Component
 * Handles license activation with Freemius integration
 * 
 * @param {object} props - Component props from data.js
 * @param {string} props.name - Plugin name
 * @param {string} props.version - Plugin version
 * @param {object} props.media - Media object containing logo
 * @param {object} props.freemius - Freemius configuration
 * @param {boolean} props.isPremium - Whether premium is active
 */
const Activation = (props) => {
    const { name, slug, version, media, freemius } = props;
    const { product_id, plan_id, public_key } = freemius || {};
    const { logo } = media || {};

    // State management
    const [licenseKey, setLicenseKey] = useState('');
    const [isActivated, setIsActivated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showLicense, setShowLicense] = useState(false);
    const [activatedLicense, setActivatedLicense] = useState('');
    const [showActivationForm, setShowActivationForm] = useState(false);

    // Fetch license status on mount
    useEffect(() => {
        const fetchLicenseStatus = async () => {
            try {
                const response = await fetch(window.apbAdmin?.ajaxurl || '/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'get_license_status',
                        nonce: window.apbAdmin?.nonce || ''
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

        fetchLicenseStatus();
    }, []);

    // Handle license activation
    const handleActivation = async () => {
        if (!licenseKey.trim()) {
            setError('Please enter a license key');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(window.apbAdmin?.ajaxurl || '/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'activate_freemius_license',
                    license_key: licenseKey,
                    product_id: product_id || '',
                    public_key: public_key || '',
                    nonce: window.apbAdmin?.nonce || ''
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsActivated(true);
                setActivatedLicense(licenseKey);
                setLicenseKey('');
                setShowActivationForm(false); // Hide form after successful activation
            } else {
                setError(data.data?.message || 'Activation failed. Please check your license key.');
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Activation error:', err);
            setError('An error occurred during activation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle deactivate license
    const handleDeactivateLicense = async () => {
        if (!window.confirm('Are you sure you want to deactivate this license?')) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(window.apbAdmin?.ajaxurl || '/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'deactivate_freemius_license',
                    nonce: window.apbAdmin?.nonce || ''
                })
            });

            const data = await response.json();

            if (data.success) {
                setIsActivated(false);
                setActivatedLicense('');
                setShowActivationForm(true);
                setLicenseKey('');
            } else {
                setError(data.data?.message || 'Deactivation failed. Please try again.');
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Deactivation error:', err);
            setError('Deactivation error: ' + (err.message || err));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle change license
    const handleChangeLicense = () => {
        setShowActivationForm(true);
    };

    // Mask license key for display
    const getMaskedLicense = (license) => {
        if (!license) return '';
        if (showLicense) return license;
        const start = license.substring(0, 4);
        const end = license.substring(license.length - 4);
        const middle = 'x'.repeat(Math.max(0, license.length - 8));
        return `${start}${middle}${end}`;
    };

    return <div className='bPlDashboardActivation bPlDashboardCard'>
        <div className='activationHeader'>
            <div className='pluginInfo'>
                {logo && <img src={logo} alt={name || 'Plugin'} />}
                <div className='pluginDetails'>
                    <h1>{name || 'Plugin'}</h1>
                    {version && <p className='version'>Current Version: {version}</p>}
                </div>
            </div>

            <div className={`statusBadge ${isActivated ? 'active' : 'inactive'}`}>
                {isActivated ? 'Actived' : 'Not Active'}
            </div>
        </div>

        <div className='activationContent'>
            {isLoading ? <div className='activationLoading'>
                <Spinner />
                <p>Loading...</p>
            </div> :
                (activatedLicense && !showActivationForm) ? <div className='activationSuccess'>
                    <div className='successIcon'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                        </svg>
                    </div>

                    <h2>License Activated</h2>

                    <p className='successMessage'>Your license has been activated and is ready to use.</p>

                    <div className='licenseDisplay'>
                        <input
                            type="text"
                            value={getMaskedLicense(activatedLicense)}
                            readOnly
                            className='licenseInput'
                        />
                        <button
                            className='toggleVisibility'
                            onClick={() => setShowLicense(prev => !prev)}
                            aria-label={showLicense ? 'Hide license' : 'Show license'}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                {showLicense ? <>
                                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M10.5 10.677a2 2 0 002.823 2.823" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c4.008 0 6.701 3.158 9 6a15.66 15.66 0 01-1.078 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </> : <>
                                    <path d="M12 5C7.52 5 3.73 7.61 1 12c2.73 4.39 6.52 7 11 7s8.27-2.61 11-7c-2.73-4.39-6.52-7-11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                </>}
                            </svg>
                        </button>
                    </div>

                    <div className='licenseActions'>
                        <button className='linkButton' onClick={handleChangeLicense}>
                            Change License
                        </button>
                        <button className='linkButton danger' onClick={handleDeactivateLicense}>
                            Deactivate License
                        </button>
                    </div>
                </div> :
                    <div className='activationForm'>
                        <h2>{showActivationForm && isActivated ? 'Change License' : 'Activate License'}</h2>

                        <p className='formDescription'>
                            Enter Your license key below. {!showActivationForm && !isActivated && <><a href={`https://dashboard.freemius.com/license-recovery/${product_id}/${slug}/`} target="_blank" rel="noopener noreferrer">Can&apos;t find license key?</a> or <a href={`https://freemius.com/help/documentation/wordpress-sdk/license-activation-issues/`} target="_blank" rel="noopener noreferrer">License issues?</a></>}
                        </p>

                        <div className='formGroup'>
                            <input
                                type="text"
                                className='licenseInput'
                                placeholder='Enter your purchase code here.'
                                value={licenseKey}
                                onChange={(e) => setLicenseKey(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {error && <div className='errorMessage'>{error}</div>}

                        <Button
                            variant="primary"
                            onClick={handleActivation}
                            disabled={isLoading}
                            className='activateButton'
                        >
                            {isLoading ? 'Activating...' : 'Activate your License'}
                        </Button>

                        {!showActivationForm && !isActivated && <>
                            <p className='formDescription'>
                                For delivery of security &amp; feature updates, and license management, <strong>{name}</strong> needs to ↓
                            </p>

                            <ul className='formPermissions'>
                                <li>
                                    {linkIcon}

                                    <div>
                                        <h4>View License Essentials <Tooltip text="To let you manage &amp; control where the license is activated and ensure plugin security &amp; feature updates are only delivered to websites you authorize." placement='top' delay={300}>
                                            {questionIcon}
                                        </Tooltip></h4>

                                        <p>Homepage URL, Plugin version, SDK version</p>
                                    </div>
                                </li>

                                <li>
                                    {pluginIcon}

                                    <div>
                                        <h4>View Plugin State <Tooltip text="So you can reuse the license when the plugin is no longer active." placement='top' delay={300}>
                                            {questionIcon}
                                        </Tooltip></h4>

                                        <p>Is active, deactivated, or uninstalled</p>
                                    </div>
                                </li>
                            </ul>

                            <div className='links'>
                                <a href={`https://freemius.com/product/license-activation/14262/advanced-post-block/`} target="_blank" rel="noopener noreferrer">Powered by Freemius</a>

                                <a href={`https://freemius.com/privacy/`} target="_blank" rel="noopener noreferrer">Privacy Policy</a>

                                <a href={`https://freemius.com/product/14262/advanced-post-block/legal/eula/`} target="_blank" rel="noopener noreferrer">License Agreement</a>
                            </div>
                        </>}

                        {showActivationForm && isActivated && <Button
                            variant="secondary"
                            onClick={() => setShowActivationForm(false)}
                            className='cancelButton'
                        >
                            Cancel
                        </Button>}
                    </div>
            }
        </div>
    </div>
};

export default Activation;
