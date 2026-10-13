import { __, _x, sprintf } from '@wordpress/i18n';

import Button from '../../Components/Button/Button';

import './style.scss';
import VideoPlayer from './VideoPlayer';

/**
 * Renders the overview section of the plugin dashboard.
 *
 * @param {object} props - The component props.
 * @param {string} [props.name] - The name of the plugin, used in the welcome title.
 * @param {string} [props.displayName] - The display name of the plugin.
 * @param {string} [props.description] - A short description of the plugin.
 * @param {string} props.slug - The WordPress.org plugin slug for generating the review link.
 * @param {string} [props.logo] - URL for the plugin's logo image.
 * @param {string} [props.banner] - URL for the plugin's banner image.
 * @param {string} [props.video] - URL for a promotional video.
 * @param {boolean} [props.isYoutube] - Indicates if the video is a YouTube video.
 * @param {object} [props.pages] - An object containing links to various pages.
 * @param {string} [props.pages.docs] - Link to the documentation page.
 * @param {string} [props.pages.landing] - Link to the plugin's landing page.
 * @param {React.ReactNode} [props.children] - Custom elements to be rendered in the button area.
 * @returns {JSX.Element} The rendered overview component.
 */
const Overview = (props) => {
	const { name, displayName, description, slug, logo, banner, video, isYoutube, pages, children } = props;

	const helpInfo = [
		{
			title: __('Need any Assistance?'),
			description: __('Our Expert Support Team is always ready to help you out promptly.'),
			link: 'https://bplugins.com/support',
			linkText: __('Contact Support')
		},
		{
			title: __('Looking for Documentation?'),
			description: __('We have detailed documentation on every aspects of the plugin.'),
			link: pages?.docs,
			linkText: __('Documentation')
		},
		{
			title: __('Liked This Plugin?'),
			description: __('Glad to know that, you can support us by leaving a 5 ⭐ rating.'),
			link: `https://wordpress.org/support/plugin/${slug}/reviews#new-post`,
			linkText: __('Rate the Plugin')
		}
	];

	return <div className='bPlDashboardOverview bPlDashboardBox'>
		<div className='overviewLeft'>
			<div className='overviewLeftTop'>
				{name && <h2 className='overviewTitle'>{sprintf(
					/* translators: %s: Plugin name. */
					__('Welcome to %s'),
					name
				)}</h2>}

				{description && <p className='overviewDescription'>{description}</p>}

				<div className='overviewBanner'>
					{video ?
						<VideoPlayer src={video} width='100%' height='100%' isYoutube={isYoutube} /> :
						(banner ? <img src={banner} alt={sprintf(
							/* translators: %s: Plugin name. */
							__('%s Banner'),
							name
						)} /> : null)
					}
				</div>

				<div className='overviewPluginInfo'>
					{logo && <img src={logo} alt={name} />}

					<div>
						{displayName && <h3>{displayName}</h3>}

						<span>{_x('by', 'plugin author, followed by bPlugins')}</span>

						<a href='https://bplugins.com' target='_blank' rel='noopener noreferrer'>
							bPlugins
						</a>
					</div>
				</div>
			</div>

			{(children || pages?.landing) && <div className='overviewLeftBottom bPlDashboardButtons'>
				{children}

				{pages?.landing && <Button href={pages.landing} target='_blank' rel='noopener noreferrer' variant='primary'>{__('Learn More')}</Button>}
			</div>}
		</div>

		<div className='overviewRight'>
			{helpInfo?.map((item, index) => {
				const { title, description, link, linkText } = item;

				return link && <div key={index} className='helpInfoItem'>
					<h4>{title}</h4>

					<p>{description}</p>

					<Button href={link} target='_blank' rel='noopener noreferrer' size='medium'>{linkText}</Button>
				</div>
			})}
		</div>
	</div>
}
export default Overview;