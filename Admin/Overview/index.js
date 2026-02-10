import Button from '../../Components/Button/Button';

import './style.scss';

/**
 * Renders the overview section of the plugin dashboard.
 *
 * @param {object} props - The component props.
 * @param {string} [props.name] - The name of the plugin, used in the welcome title.
 * @param {string} [props.displayName] - The display name of the plugin.
 * @param {string} [props.description] - A short description of the plugin.
 * @param {string} props.slug - The WordPress.org plugin slug for generating the review link.
 * @param {string} [props.media.thumbnail] - URL for the plugin's feature image.
 * @param {string} [props.video] - URL for a promotional video.
 * @param {boolean} [props.isYoutube] - Indicates if the video is a YouTube video.
 * @param {object} [props.pages] - An object containing links to various pages.
 * @param {string} [props.pages.docs] - Link to the documentation page.
 * @param {string} [props.pages.landing] - Link to the plugin's landing page.
 * @param {React.ReactNode} [props.children] - Custom elements to be rendered in the button area.
 * @returns {JSX.Element} The rendered overview component.
 */
const Overview = (props) => {
	const { name, displayName, description, slug, media, video, isYoutube, isPremium, pages, children } = props;
	const { thumbnail } = media || {};

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

					{(children || pages?.landing) && <div className='buttons'>
						{!isPremium && <Button href='#pricing'>Buy Now</Button>}

						{pages?.landing && <Button href={pages.landing} target='_blank' rel='noopener noreferrer'>Learn More</Button>}
					</div>}
				</div>

				{thumbnail && <div className='overviewBanner'>
					<img src={thumbnail} alt={name} />
				</div>}
			</div>

			{children}
		</div>

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
export default Overview;