/**
	* Overview Component
	*
	* @props name (required): plugin name (String)
	* @props version (required): plugin version (String)
	* @props description (required): tagline text (String)
	* @props isPremium (required): whether the plugin is premium (Boolean)
	* @props media (required): {thumbnail?, video?, isYoutube?} (Object)
	* @props pages (required): {landing?} - enables "View Demos" button (Object)
	* @props startButton (required): {label, url} - primary CTA button (Object)
	* @props keywords (required): chip labels shown below the tagline (Array)
	* @props keywordsLabel (required): label before keyword chips (String)
	* @props currentUser (required): injected by withSelect from the WP core store (Object)
	*/

import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import Button from '../../../Components/Button/Button';
import VideoPlayer from '../../Overview/VideoPlayer';
import { closeIcon, playIcon, crownIcon, plusIcon, gridIcon, arrowRightIcon, questionIcon } from '../../utils/icons';

import './style.scss';

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

			{pages?.docs && <Button
				className='secondaryBtn'
				href={pages.docs}
				target='_blank'
				rel='noopener noreferrer'
			>
				{questionIcon}
				{__('Read Documentation')}
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

				<VideoPlayer
					key={video}
					src={video}
					isYoutube={isYoutube}
					autoPlay={true}
					title={`${name} walkthrough`}
				/>
			</div>

			<div className='bPlVideoModalOverlay' onClick={() => setShowVideo(false)} />
		</div>}
	</div>;
};

export default withSelect(select => ({
	currentUser: select('core').getCurrentUser?.()
}))(Overview);
