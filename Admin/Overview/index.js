import { useState } from 'react';
import { withSelect } from '@wordpress/data';

import Button from '../../Components/Button/Button';
import { closeIcon, playIcon } from '../../utils/icons';

import './style.scss';
import VideoPlayer from './VideoPlayer';

/**
 * Overview Component
 * Renders the welcome section of the plugin dashboard with banners and quick links.
 *
 * @param {object} props - Component props
 * @param {string} [props.name] - Plugin name
 * @param {string} props.slug - WordPress.org plugin slug
 * @param {object} [props.media] - Media configuration {thumbnail}
 * @param {object} [props.pages] - Link configuration {docs, landing}
 * @returns {JSX.Element}
 */
const Overview = (props) => {
	const { name, description, slug, media, isPremium, pages, startButton, site, children } = props;
	const { thumbnail, video, isYoutube } = media || {};

	const [showVideo, setShowVideo] = useState(false);

	const helpInfo = [
		{
			title: 'Looking for Documentation?',
			description: 'We have detailed documentation on every aspects of the plugin.',
			link: pages?.docs,
			linkText: 'Documentation'
		},
		{
			title: 'Liked This Plugin?',
			description: 'Glad to know that, you can support us by leaving a feedback.',
			link: `https://wordpress.org/support/plugin/${slug}/reviews#new-post`,
			linkText: 'Rate the Plugin'
		},
		{
			image: 'https://bplugins.com/wp-content/themes/b-technologies/assets/images/resource/support.png',
			title: 'Need any Assistance?',
			description: 'Our Expert Support Team is always ready to help you out promptly.',
			link: 'https://bplugins.com/support',
			linkText: 'Contact Support'
		},
		{
			titleIcon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 292 512' fill='#1877F2'>
				<path d='m66 299.3v212.7h116v-212.7h86.5l18-97.8h-104.5v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 0.4 37 1.2v-88.7c-14.3-3.9-49.3-7.9-69.5-7.9-106.9 0-156.2 50.5-156.2 159.4v42.1h-66v97.8z' />
			</svg>,
			title: 'Join Our Community',
			description: 'Get tutorials, plugin updates, feature announcements, and support from other WordPress users.',
			link: 'https://facebook.com/groups/1828495198556137',
			linkText: 'Join Now →'
		}
	];

	return <div className='bPlDashboardOverview'>
		<div className='overviewLeft'>
			<div className='overviewLeftTop bPlDashboardCard'>
				<div>
					{name && <h2>Welcome to {name}</h2>}

					{description && <p>{description}</p>}

					<div className='buttons'>
						{!isPremium && <Button href='#pricing'>Buy Now</Button>}

						{startButton?.url && startButton?.label && <Button href={`${site?.url}/${startButton.url}`} target='_blank' rel='noopener noreferrer'>{startButton.label}</Button>}

						{pages?.landing && <Button href={pages.landing} target='_blank' rel='noopener noreferrer'>Learn More</Button>}
					</div>
				</div>

				{thumbnail && <div className='overviewBanner'>
					<img src={thumbnail} alt={name} />

					{video && <button className='playButton' onClick={() => setShowVideo(true)}>
						{playIcon}
					</button>}
				</div>}
			</div>

			{children}
		</div>

		{showVideo && video && <div className='bPlVideoModal'>
			<div className='bPlVideoModalContent'>
				<button className='closeModal' onClick={() => setShowVideo(false)}>
					{closeIcon}
				</button>

				<VideoPlayer
					src={video}
					isYoutube={isYoutube}
					autoPlay={true}
				/>
			</div>

			<div className='bPlVideoModalOverlay' onClick={() => setShowVideo(false)} />
		</div>}

		<div className='overviewRight'>
			{helpInfo?.map((item, index) => {
				const { image, titleIcon, title, description, link, linkText } = item;

				return link && <div key={index} className='helpInfoItem bPlDashboardCard'>
					{image && <figure>
						<img src={image} alt='Support Thumb' />
					</figure>}

					<h4>{title} {titleIcon}</h4>

					<p>{description}</p>

					<Button href={link} target='_blank' rel='noopener noreferrer'>{linkText}</Button>
				</div>
			})}
		</div>
	</div>
}
export default withSelect((select) => {
	const { getSite } = select('core');

	return {
		site: getSite?.()
	}
})(Overview);