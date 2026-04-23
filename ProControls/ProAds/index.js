import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

import './style.scss';
import { Button } from '../../Components';
import { starIcon, checkIcon } from '../../utils/icons';

const ProAds = ({ isPremium, list, link }) => {
	if (isPremium) return null;

	const ads = [
		{
			type: 'lifetime',
			badge: __('Premium Deal'),
			title: __('Go Professional'),
			description: __('Remove barriers and unlock premium features.'),
			buttonText: __('Get Pro Access'),
			link,
		},
		{
			type: 'powerup',
			icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 448'>
				<path d='m445.6 6.3c-0.4-1.8-1.8-3.2-3.5-3.7-58.6-14.3-193.9 36.7-267.2 110-13.1 13-25 27.1-35.6 42.1-22.6-2-45.2-0.3-64.5 8.1-54.4 23.9-70.2 86.4-74.7 113.2-0.9 5.2 2.6 10.2 7.9 11.1 0.9 0.1 1.8 0.2 2.7 0.1l87.3-9.6c0.1 6.6 0.5 13.2 1.2 19.7 0.4 4.5 2.5 8.8 5.7 12l33.8 33.7c3.2 3.2 7.5 5.3 12 5.7 6.5 0.7 13 1.1 19.6 1.2l-9.6 87.2c-0.6 5.3 3.3 10.1 8.6 10.6 0.9 0.1 1.8 0.1 2.6-0.1 26.8-4.3 89.4-20.1 113.2-74.5 8.4-19.3 10.1-41.8 8.2-64.3 15.1-10.6 29.2-22.6 42.2-35.6 73.5-73.1 124.2-205.4 110.1-266.9zm-115.7 179.6c-18.7 18.7-49.1 18.8-67.8 0-18.8-18.7-18.8-49.1 0-67.9 18.7-18.8 49.1-18.8 67.9 0 18.7 18.8 18.7 49.2-0.1 67.9z' />
				<path d='m136.4 367.4c-5.5 5.5-14.3 7.6-24.9 9.5-23.8 4-44.8-16.5-40.5-40.5 1.6-9.1 6.5-21.9 9.5-24.9 1.7-1.7 1.8-4.5 0.1-6.2-1-1-2.3-1.5-3.7-1.3-13.3 1.6-25.7 7.7-35.1 17.1-23.6 23.6-25.8 110.9-25.8 110.9 0 0 87.4-2.2 110.9-25.8 9.5-9.5 15.5-21.8 17.1-35.2 0.4-4.1-4.7-6.6-7.6-3.6z' />
			</svg>,
			title: __('Power Up The Site'),
			description: __('Get access to premium features and enhance your website.'),
			buttonText: __('Unlock Now'),
			link,
		},
		{
			type: 'agency',
			badge: __('RECOMMENDED'),
			title: __('Premium Plan'),
			description: __('Use every premium features.'),
			buttonText: __('Go Premium'),
			link,
		},
		{
			type: 'membership',
			header: __('PRO SUBSCRIPTION'),
			list,
			buttonText: __('Upgrade Now'),
			link,
		}
	];

	const ad = useMemo(() => ads[Math.floor(Math.random() * ads.length)], []);

	return <div className={`bPlProAds ad-type-${ad.type}`}>
		<div className='bPlProAds-content'>
			{ad.badge && <span className='ad-badge'>{ad.badge}</span>}
			{ad.icon && <div className="ad-icon-wrapper">{ad.icon}</div>}
			{ad.header && <h4 className="ad-header">{ad.header}</h4>}

			<h3 className="ad-title">{ad.title}</h3>

			{ad.description && <p className="ad-description">{ad.description}</p>}

			{ad.list && (
				<ul className="ad-list">
					{ad.list.map((item, index) => (
						<li key={index}>
							<span className="list-icon">{checkIcon}</span>
							{item}
						</li>
					))}
				</ul>
			)}

			<div className="ad-action">
				<Button
					variant="primary"
					href={ad.link}
					target="_blank"
					rel="noopener noreferrer"
				>
					{ad.buttonText}
				</Button>
			</div>
		</div>
	</div>
}

export default ProAds;