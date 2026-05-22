import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import useWPAjax from '../../hooks/useWPAjax';

import './style.scss';

import { trashIcon, alertIcon, shieldIcon, checkCircleIcon, closeIcon } from '../utils/icons';

/**
 * Uninstall-data management page — toggle to permanently delete plugin data on uninstall.
 * Requires a PHP AJAX handler whose action name matches `ajaxAction`.
 *
 * @param {object}   props
 * @param {string}   props.name                  - Plugin name shown in description text
 * @param {boolean}  props.deleteDataOnUninstall  - Current setting value (from PHP option)
 * @param {string}   props.uninstallNonce         - wp_create_nonce('bPlLicenseActivation')
 * @param {string}   props.ajaxAction             - WP Ajax action to call on toggle (e.g. 'apbSaveUninstallOption')
 * @param {string}   [props.version]              - Plugin version shown in the status strip
 * @param {string[]} [props.cleanupItems]         - Overrides default list of items deleted on uninstall
 */
const Settings = ({ name, deleteDataOnUninstall, uninstallNonce, version, ajaxAction = '', cleanupItems }) => {
	const [enabled, setEnabled] = useState(deleteDataOnUninstall);
	const [notice, setNotice] = useState('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmInput, setConfirmInput] = useState('');

	const { data, saveData, isLoading, error } = useWPAjax(ajaxAction, { nonce: uninstallNonce }, false);

	useEffect(() => {
		if (data) {
			setEnabled(data.enabled);
			setNotice(data.message || '');
			const t = setTimeout(() => setNotice(''), 4000);
			return () => clearTimeout(t);
		}
	}, [data]);

	useEffect(() => {
		if (error) setNotice(__('Failed to save setting.'));
	}, [error]);

	const defaultCleanupItems = [
		__('All plugin posts and custom post types'),
		__('Plugin settings and options'),
		__('Layout configuration and meta data'),
		__('Taxonomy terms and associations'),
		__('All tracking and analytics data'),
	];

	const items = cleanupItems || defaultCleanupItems;

	const requestToggle = () => {
		if (isLoading) return;
		if (!enabled) {
			setConfirmInput('');
			setShowConfirm(true);
			return;
		}
		setNotice('');
		saveData({ enabled: String(false) });
	};

	const confirmEnable = () => {
		if (confirmInput.trim().toUpperCase() !== 'DELETE') return;
		setShowConfirm(false);
		setNotice('');
		saveData({ enabled: String(true) });
	};

	return <div className='bPlDashboardSettings'>
		<header className='settingsHero'>
			<span className='settingsEyebrow'>{__('Settings')}</span>
			<h1>{__('Manage plugin preferences')}</h1>
			<p>{__(`Control how ${name} behaves on your site. Destructive options live in their own clearly-marked zone.`)}</p>
		</header>

		<section className='settingsStatus'>
			<div className='settingsStatusIcon'>
				{shieldIcon}
			</div>

			<div className='settingsStatusBody'>
				<h2>{enabled ? __('Data deletion is enabled') : __('Your data is protected')}</h2>
				<p>
					{enabled
						? __('All plugin data will be permanently removed if the plugin is uninstalled.')
						: __('Even if you deactivate or uninstall the plugin, your settings and data stay intact.')}
				</p>
			</div>

			{version && <span className='settingsVer'>v{version}</span>}
		</section>

		<section className={`settingsCard dangerZone ${enabled ? 'isArmed' : ''}`}>
			<header className='settingsCardHead'>
				<span className='dangerBadge'>
					{alertIcon}
					{__('Danger Zone')}
				</span>

				<div>
					<h2>{__('Delete plugin data on uninstall')}</h2>
					<p>{__(`When enabled, every piece of ${name} data is wiped from your database the moment the plugin is uninstalled.`)}</p>
				</div>
			</header>

			<div className='settingsCardBody'>
				<p className='cleanupLabel'>{__('What will be permanently deleted:')}</p>

				<ul className='cleanupList'>
					{items.map((item, i) => <li key={i}>
						<span className='cleanupDot'>{trashIcon}</span>
						{item}
					</li>)}
				</ul>

				<div className='settingsWarn'>
					{alertIcon}
					<span>{__('This action cannot be undone. Deactivating the plugin alone is non-destructive — your data is only deleted when you also click "Delete" on the plugins screen.')}</span>
				</div>
			</div>

			<footer className='settingsCardFoot'>
				<div className='toggleRow'>
					<label className='settingsToggle'>
						<input
							type='checkbox'
							checked={!!enabled}
							onChange={requestToggle}
							disabled={isLoading}
							aria-label={__('Toggle data deletion on uninstall')}
						/>
						<span className='toggleSlider' />
					</label>

					<div className='toggleLabel'>
						<strong>{enabled ? __('Deletion is ON') : __('Deletion is OFF')}</strong>
						<span>{enabled ? __('Data will be removed on uninstall') : __('Data will be preserved on uninstall')}</span>
					</div>
				</div>

				{isLoading && <span className='settingsSaving'>{__('Saving…')}</span>}
			</footer>
		</section>

		{notice && <div className={`settingsToast ${enabled ? 'warning' : 'success'}`} role='status'>
			{checkCircleIcon}
			<span>{notice}</span>
			<button onClick={() => setNotice('')} aria-label={__('Dismiss')}>
				{closeIcon}
			</button>
		</div>}

		{showConfirm && <div className='settingsConfirmModal' role='dialog' aria-modal='true'>
			<div className='confirmBackdrop' onClick={() => setShowConfirm(false)} />

			<div className='confirmContent'>
				<header>
					<span className='confirmIcon'>{trashIcon}</span>
					<h3>{__('Enable data deletion on uninstall?')}</h3>
					<button className='confirmClose' onClick={() => setShowConfirm(false)} aria-label={__('Close')}>
						{closeIcon}
					</button>
				</header>

				<div className='confirmBody'>
					<p>{__('Switching this on means that the next time this plugin is uninstalled, all data, configurations, and settings will be permanently removed from your database.')}</p>

					<div className='confirmCallout'>
						{alertIcon}
						<span>{__('There is no recovery once data is deleted. Make sure you have a recent backup.')}</span>
					</div>

					<label className='confirmField'>
						<span>{__('Type')} <code>DELETE</code> {__('to confirm')}</span>
						<input
							type='text'
							value={confirmInput}
							onChange={(e) => setConfirmInput(e.target.value)}
							placeholder='DELETE'
							autoFocus
						/>
					</label>
				</div>

				<footer>
					<button className='confirmCancel' onClick={() => setShowConfirm(false)}>
						{__('Cancel')}
					</button>
					<button
						className='confirmAction'
						onClick={confirmEnable}
						disabled={confirmInput.trim().toUpperCase() !== 'DELETE'}
					>
						{trashIcon}
						{__('Enable deletion')}
					</button>
				</footer>
			</div>
		</div>}
	</div>;
};
export default Settings;
