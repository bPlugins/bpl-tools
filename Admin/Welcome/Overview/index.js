import { useState } from 'react';
import { withSelect } from '@wordpress/data';

import Button from '../../../Components/Button/Button';
import { closeIcon, playIcon, crownIcon, plusIcon, gridIcon, arrowRightIcon } from '../../utils/icons';

import './style.scss';

const getYoutubeEmbedSrc = (url) => {
	const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
	const short = url.match(/youtu\.be\/([^#&?]+)/);
	const id = (match && match[2]?.length === 11) ? match[2] : (short && short[1]?.length === 11 ? short[1] : '');
	return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : url;
};


/**
 * Welcome overview card — hero section of the plugin dashboard.
 *
 * @param {object}   props
 * @param {string}   props.name
 * @param {string}   props.version
 * @param {string}   props.description
 * @param {boolean}  props.isPremium
 * @param {object}   props.media          - {thumbnail?, video?, isYoutube?}
 * @param {object}   props.pages          - {landing?} — enables "View Demos" button
 * @param {object}   props.startButton    - {label, url} — primary CTA button
 * @param {string[]} props.keywords       - chip labels shown below the tagline (e.g. ['Grid', 'Masonry'])
 * @param {string}   props.keywordsLabel  - label before keyword chips (e.g. 'Layouts')
 * @param {object}   props.currentUser    - injected by withSelect from the WP core store
 */
const Overview = (props) => {
	const { name, version, description, isPremium, media, pages, startButton, currentUser, keywords, keywordsLabel } = props;
	const { thumbnail, video, isYoutube } = media || {};

	const [showVideo, setShowVideo] = useState(false);

	const firstName = currentUser?.name ? currentUser.name.split(/\s+/)[0] : '';

	return <div className='bPlDashboardWelcomeOverview bPlDashboardCard'>
		<div className='statusRow'>
			<span className='activeStatus'>
				<span className='statusDot' aria-hidden='true' />
				Plugin active
			</span>

			<span className={`planBadge ${isPremium ? 'isPro' : 'isFree'}`}>
				{isPremium && crownIcon}
				{isPremium ? 'Pro Plan' : 'Free Plan'}
			</span>

			{version && <span className='versionBadge'>v{version}</span>}
		</div>

		{name && <h2>Welcome to {name}</h2>}

		{description && <p className='tagline'>
			{firstName ? <>Hi <strong>{firstName}</strong>, {description}</> : description}
		</p>}

		{thumbnail && <div className='banner'>
			<img src={thumbnail} alt={name} />

			{video && <button className='playBtn' onClick={() => setShowVideo(true)} aria-label='Play product walkthrough'>
				{playIcon}
			</button>}

			{video && <span className='bannerCaption'>Watch quick start · 2 min</span>}
		</div>}

		{keywords?.length > 0 && <div className='keywords'>
			<span className='keywordsLabel'>{keywordsLabel}</span>
			{keywords.map(f => <span key={f} className='formatChip'>{f}</span>)}
		</div>}

		<div className='actionButtons'>
			{startButton?.url && startButton?.label && <Button
				className='primaryBtn'
				href={startButton.url}
				target='_blank'
				rel='noopener noreferrer'
			>
				{plusIcon}
				{startButton.label}
			</Button>}

			{pages?.landing && <Button
				className='secondaryBtn'
				href={pages.landing}
				target='_blank'
				rel='noopener noreferrer'
			>
				{gridIcon}
				View Demos
			</Button>}

			{!isPremium && <a className='ghostBtn' href='#pricing'>
				{crownIcon}
				Upgrade to Pro
				{arrowRightIcon}
			</a>}
		</div>

		{showVideo && video && <div className='bPlVideoModal'>
			<div className='bPlVideoModalContent'>
				<button className='closeModal' onClick={() => setShowVideo(false)} aria-label='Close video'>
					{closeIcon}
				</button>

				{isYoutube
					? <iframe key={video} src={getYoutubeEmbedSrc(video)} title='Product walkthrough' frameBorder={0} allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowFullScreen />
					: <video key={video} src={video} autoPlay controls playsInline />
				}
			</div>

			<div className='bPlVideoModalOverlay' onClick={() => setShowVideo(false)} />
		</div>}
	</div>;
};

export default withSelect(select => ({
	currentUser: select('core').getCurrentUser?.()
}))(Overview);
