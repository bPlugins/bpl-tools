/**
	* OurPlugins Component
	*
	* @props slug (required): current plugin slug to exclude from the list (String)
	* @props slugs (optional): list of bPlugins slugs to display (Array)
	* @props installedPlugins (required): installed plugins provided by withSelect (Array)
	*/

import { useEffect, useState } from 'react';
import { withSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

import Button from '../../Components/Button/Button';

import './style.scss';

// Format download count with appropriate suffix
const formatDownloadCount = (num) => {
	if (num === undefined || num === null) return '0';

	const absNum = Math.abs(num);

	if (absNum >= 1000000000) {
		return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
	}
	if (absNum >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	if (absNum >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
	}
	return num.toString();
};

// Extract plugin name before dash or em-dash
const getPluginDisplayName = (name) => {
	if (!name) return '';
	// Replace HTML entities with their character equivalents
	let decodedName = name
		.replace(/&#8211;/g, '–')	// en-dash entity
		.replace(/&#8212;/g, '—')	// em-dash entity
		.replace(/&ndash;/g, '–')	// en-dash named entity
		.replace(/&mdash;/g, '—')	// em-dash named entity
		.replace(/&#45;/g, '-');	// hyphen entity

	return decodedName.split(/\s*[–\-—]\s*/)[0].trim();
};

const handleInstall = async (slug, path, status, setStatus) => {
	setStatus('installed' === status ? 'activating' : 'installing');

	try {
		// If plugin is already installed, just activate it
		if ('installed' === status && path) {

			await apiFetch({
				path: `/wp/v2/plugins/${path}`,
				method: 'POST',
				data: {
					status: 'active'
				},
			});

			setStatus('success');

			// eslint-disable-next-line no-console
			console.log(`Successfully activated: ${slug}`);

			setTimeout(() => {
				setStatus('activated');
			}, 1000);
			return;
		}

		// Install and activate new plugin
		const response = await apiFetch({
			path: '/wp/v2/plugins',
			method: 'POST',
			data: {
				slug,
				status: 'active'
			},
		});

		setStatus('success');

		// eslint-disable-next-line no-console
		console.log(`Successfully installed: ${response.name}`);

		setTimeout(() => {
			setStatus('activated');
		}, 1000);
	} catch (error) {
		setStatus('error');

		// eslint-disable-next-line no-console
		console.error('Installation failed:', error.message);

		setTimeout(() => {
			setStatus('installed' === status ? 'installed' : 'notfound');
		}, 1000);
	}
};

const OurPlugins = ({ slug, slugs: allSlugs = ['3d-viewer', 'html5-video-player', 'html5-audio-player', 'pdf-poster', 'document-emberdder', 'advanced-post-block', 'advance-custom-html', 'b-carousel-block', 'b-blocks', 'html5-video-player', 'embed-lottie-player', 'b-slider'], installedPlugins } = {}) => {
	const [plugins, setPlugins] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const slugs = allSlugs?.filter(s => s !== slug);

	useEffect(() => {
		const fetchPlugins = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[author]=bplugins&request[per_page]=100&request[fields]=title,name,slug,icons,short_description,version,active_installs,rating,ratings,downloaded`, {
					credentials: 'omit',
					mode: 'cors'
				});
				const data = await response.json();
				setPlugins(data?.plugins?.filter(p => slugs.includes(p.slug)) || []);
				setIsLoading(false);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Error fetching plugins:', error);
				setPlugins([]);
				setIsLoading(false);
			}
		};

		if (slugs && slugs.length > 0) {
			fetchPlugins();
		}
	}, [JSON.stringify(slugs)]);

	if (isLoading) {
		return <div className='bPlDashboardBox' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<h2>Loading...</h2>
		</div>;
	}

	return <div className='bPlDashboardOurPlugins'>
		{plugins?.length > 0 ? <div className='pluginsList'>
			{plugins
				.sort((a, b) => b.active_installs - a.active_installs)
				.map((plugin) => {
					const { slug } = plugin;

					const installed = installedPlugins?.find(i => i?.plugin?.includes(slug)) ?? false;

					const activated = installed ? 'active' === installed?.status : false;

					return <PluginCard key={slug} plugin={plugin} path={installed?.plugin} initStatus={activated ? 'activated' : (installed ? 'installed' : 'notfound')} />
				})}
		</div> :
			<p>No plugins found</p>
		}
	</div>
}
export default withSelect((select) => {
	const { getPlugins } = select('core');

	return {
		installedPlugins: getPlugins?.({ per_page: -1 })
	}
})(OurPlugins);

const PluginCard = ({ plugin, path, initStatus }) => {
	const { name, slug, icons, short_description, downloaded } = plugin;

	const [status, setStatus] = useState(initStatus);

	return <div className='pluginCard'>
		<div className='cardHeader'>
			<img src={icons?.['1x'] || icons?.['2x']} alt={name} />

			<h3 dangerouslySetInnerHTML={{ __html: getPluginDisplayName(name) }} />
		</div>

		<p className='description' dangerouslySetInnerHTML={{ __html: short_description }} />

		<div className='cardFooter'>
			<div className='downloads'>
				Download: {formatDownloadCount(downloaded)}
			</div>

			<div className='rating'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
					<path d='M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z' />
				</svg>

				<span className='value'>{(plugin?.rating / 20).toFixed(1)} Rating</span>
			</div>
		</div>

		<Button
			disabled={['activated', 'success', 'installing'].includes(status)}
			onClick={() => {
				if (!['activated', 'success', 'installing'].includes(status)) {
					handleInstall(slug, path, status, setStatus);
				}
			}}
			className={status}
		>
			{(() => {
				switch (status) {
					case 'activated':
					case 'success':
						return 'Activated';

					case 'installed':
						return 'Activate';

					case 'activating':
						return 'Activating...';

					case 'installing':
						return 'Installing...';

					case 'error':
						return 'Failed to Install';

					case 'notfound':
					default:
						return 'Install & Activate'
				}
			})()}
		</Button>
	</div>
}