import { useState } from 'react';
import { withSelect } from '@wordpress/data';

import './style.scss';

import Button from '../../Components/Button/Button';
import VideoPlayer from './VideoPlayer';
import { closeIcon, playIcon } from '../../utils/icons';

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
	const { name, description, slug, media, isPremium, pages, startCreate, site, children } = props;
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

						{startCreate?.content && site?.url && <Button href={`${site?.url}/wp-admin/post-new.php?post_type=page&title=${startCreate?.title}&content=${startCreate?.content}&nonce=${startCreate?.nonce}`} target='_blank' rel='noopener noreferrer'>Start Now</Button>}

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
				const { image, title, description, link, linkText } = item;

				return link && <div key={index} className='helpInfoItem bPlDashboardCard'>
					{image && <figure>
						<img src={image} alt='Support Thumb' />
					</figure>}

					<h4>{title}</h4>

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