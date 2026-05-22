import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import './style.scss';

import { circleCheckIcon, showLicenseIcon, hideLicenseIcon, keyIcon, copyIcon, infoIcon, shieldIcon, refreshIcon, externalIcon } from '../utils/icons';
import useLicense from './useLicense';

/**
 * License activation / deactivation page.
 * Communicates with the bPlugins LicenseActivation.php AJAX bridge.
 *
 * @param {object} props
 * @param {string} props.name               - Plugin name
 * @param {string} props.slug               - WordPress.org slug (Freemius recover-license + EULA links)
 * @param {string} [props.version]          - Plugin version shown in the card header
 * @param {object} [props.media]            - {logo?}
 * @param {object} props.freemius           - {product_id, public_key}
 * @param {string} props.licenseActiveNonce - wp_create_nonce('bPlLicenseActivation')
 */
const Activation = (props) => {
	const { name, slug, version, media, freemius, licenseActiveNonce } = props;
	const { product_id, public_key } = freemius || {};
	const { logo } = media || {};

	const {
		isActivated,
		isLoading,
		error,
		activatedLicense,
		activateLicense,
		deactivateLicense
	} = useLicense({ product_id, public_key, licenseActiveNonce });

	const [licenseKey, setLicenseKey] = useState('');
	const [showLicense, setShowLicense] = useState(false);
	const [showActivationForm, setShowActivationForm] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleActivation = async () => {
		const ok = await activateLicense(licenseKey);
		if (ok) {
			setLicenseKey('');
			setShowActivationForm(false);
			window.location.reload();
		}
	};

	const handleDeactivate = async () => {
		setShowConfirm(false);
		const ok = await deactivateLicense();
		if (ok) {
			setShowActivationForm(true);
			setLicenseKey('');
			window.location.reload();
		}
	};

	const copyLicense = async () => {
		if (!activatedLicense) return;
		try {
			await navigator.clipboard.writeText(activatedLicense);
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e.message);
		}
	};

	const getMaskedLicense = (license) => {
		if (!license) return '';
		if (showLicense) return license;
		const start = license.substring(0, 4);
		const end = license.substring(license.length - 4);
		const middle = '•'.repeat(Math.max(0, license.length - 8));
		return `${start}${middle}${end}`;
	};

	const isChangeLicense = showActivationForm && isActivated;
	const showSuccessView = isActivated && !showActivationForm;

	return <div className='bPlDashboardActivation'>
		<header className='actHero'>
			<span className='actEyebrow'>{__('License')}</span>
			<h1>
				{showSuccessView
					? __('Your license is active')
					: (isChangeLicense ? __('Change your license key') : __('Activate your license'))}
			</h1>
			<p>
				{showSuccessView
					? <>{__("You're receiving security updates, new features and priority support for")}{' '}<strong>{name}</strong>{'.'}</>
					: <>{__('Enter the license key you received with your purchase to unlock premium features and updates for')}{' '}<strong>{name}</strong>{'.'}</>
				}
			</p>
		</header>

		<section className={`actCard ${showSuccessView ? 'isActive' : 'isInactive'}`}>
			<header className='actCardHead'>
				<div className='actPluginInfo'>
					{logo && <img src={logo} alt={name || __('Plugin')} />}
					<div>
						<h2>{name || __('Plugin')}</h2>
						{version && <span className='actVer'>v{version}</span>}
					</div>
				</div>

				<span className={`actStatus ${isActivated ? 'isOk' : 'isOff'}`}>
					<span className='actStatusDot' />
					{isActivated ? __('Activated') : __('Not activated')}
				</span>
			</header>

			{isLoading && <div className='actLoading'>
				<div className='actSpinner' />
				<p>{__('Talking to the license server…')}</p>
			</div>}

			{!isLoading && showSuccessView && <div className='actBody'>
				<div className='actSuccessTop'>
					<div className='actSuccessIcon'>
						{circleCheckIcon}
					</div>
					<div>
						<h3>{__('License verified')}</h3>
						<p>{__('Your purchase code is bound to this site and is in good standing.')}</p>
					</div>
				</div>

				<div className='actLicenseRow'>
					<span className='actFieldLabel'>{__('License key')}</span>
					<div className='actLicenseDisplay'>
						<input type='text' value={getMaskedLicense(activatedLicense)} readOnly />
						<button
							type='button'
							className='actIconBtn'
							onClick={() => setShowLicense(v => !v)}
							aria-label={showLicense ? __('Hide license') : __('Show license')}
						>
							{showLicense ? showLicenseIcon : hideLicenseIcon}
						</button>
						<button
							type='button'
							className={`actIconBtn ${copied ? 'isCopied' : ''}`}
							onClick={copyLicense}
							aria-label={__('Copy license to clipboard')}
						>
							{copyIcon}
							{copied && <span className='actCopiedTip'>{__('Copied')}</span>}
						</button>
					</div>
				</div>

				<footer className='actFoot'>
					<button type='button' className='actLinkBtn' onClick={() => setShowActivationForm(true)}>
						{refreshIcon}
						{__('Change license')}
					</button>
					<button type='button' className='actLinkBtn isDanger' onClick={() => setShowConfirm(true)}>
						{__('Deactivate license')}
					</button>
				</footer>
			</div>}

			{!isLoading && !showSuccessView && <div className='actBody'>
				<label className='actField'>
					<span className='actFieldLabel'>
						{keyIcon}
						{__('License key')}
					</span>
					<input
						type='text'
						value={licenseKey}
						placeholder='xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'
						onChange={e => setLicenseKey(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && licenseKey.trim() && handleActivation()}
						disabled={isLoading}
						autoFocus
						spellCheck={false}
						autoCapitalize='none'
						autoCorrect='off'
					/>
				</label>

				{error && <div className='actError'>
					{infoIcon}
					<span>{error}</span>
				</div>}

				<button
					type='button'
					className='actPrimaryBtn'
					onClick={handleActivation}
					disabled={isLoading || !licenseKey.trim()}
				>
					{isLoading ? __('Activating…') : (isChangeLicense ? __('Update License') : __('Activate License'))}
				</button>

				{!isChangeLicense && <p className='actHelp'>
					{__("Can't find your key?")}{' '}
					<a href={`https://dashboard.freemius.com/license-recovery/${product_id}/${slug}/`} target='_blank' rel='noopener noreferrer'>
						{__('Recover license')}{externalIcon}
					</a>
					{' '}{__('or')}{' '}
					<a href='https://freemius.com/help/documentation/wordpress-sdk/license-activation-issues/' target='_blank' rel='noopener noreferrer'>
						{__('activation help')}{externalIcon}
					</a>
				</p>}

				{!isChangeLicense && <div className='actPermsBlock'>
					<h4>{name}{' '}{__('needs the following to deliver updates & security patches')}</h4>
					<ul className='actPerms'>
						<li>
							<span className='actPermIcon'>{shieldIcon}</span>
							<div>
								<strong>{__('License essentials')}</strong>
								<span>{__('Homepage URL · Plugin version · SDK version')}</span>
							</div>
						</li>
						<li>
							<span className='actPermIcon'>{refreshIcon}</span>
							<div>
								<strong>{__('Plugin state')}</strong>
								<span>{__('Whether the plugin is active, deactivated or uninstalled')}</span>
							</div>
						</li>
					</ul>
				</div>}

				{!isChangeLicense && <footer className='actLegalRow'>
					<a href={`https://freemius.com/product/license-activation/${product_id}/${slug}/`} target='_blank' rel='noopener noreferrer'>{__('Powered by Freemius')}</a>
					<span>·</span>
					<a href='https://freemius.com/privacy/' target='_blank' rel='noopener noreferrer'>{__('Privacy Policy')}</a>
					<span>·</span>
					<a href={`https://freemius.com/product/${product_id}/${slug}/legal/eula/`} target='_blank' rel='noopener noreferrer'>{__('License Agreement')}</a>
				</footer>}

				{isChangeLicense && <button type='button' className='actLinkBtn isCenter' onClick={() => setShowActivationForm(false)}>
					{__('Cancel and keep current license')}
				</button>}
			</div>}
		</section>

		{showConfirm && <div className='actModal' role='dialog' aria-modal='true'>
			<div className='actModalBackdrop' onClick={() => setShowConfirm(false)} />
			<div className='actModalContent'>
				<header>
					<div className='actModalIcon'>{infoIcon}</div>
					<div>
						<h3>{__('Deactivate this license?')}</h3>
						<p>{__('You can re-activate it later on this site or move it to a different one.')}</p>
					</div>
				</header>
				<div className='actModalNote'>
					{__('Premium features and automatic updates will stop on this site until you re-activate.')}
				</div>
				<footer>
					<button type='button' className='actModalCancel' onClick={() => setShowConfirm(false)}>
						{__('Keep license active')}
					</button>
					<button type='button' className='actModalAction' onClick={handleDeactivate}>
						{__('Yes, deactivate')}
					</button>
				</footer>
			</div>
		</div>}
	</div>;
};

export default Activation;
