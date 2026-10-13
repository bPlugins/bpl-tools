/**
	* Info Component
	*
	* @props slug (required): plugin slug - builds the review link (String)
	* @props pages (required): pages config (Object)
	* @props helpItems (optional): override default help cards; each {image?, titleIcon?, title, description, link, linkText} (Array)
	*/

import { __ } from '@wordpress/i18n';

import Button from '../../../Components/Button/Button';
import { facebookIcon } from '../../utils/icons';

import './style.scss';

const defaultHelpItems = (slug, pages) => [
	{
		title: __('Need any Assistance?'),
		description: __('Our Expert Support Team is always ready to help you out promptly.'),
		link: 'https://bplugins.com/support',
		linkText: __('Contact Support')
	},
	{
		titleIcon: facebookIcon,
		title: __('Join Our Community'),
		description: __('Get tutorials, plugin updates, feature announcements, and support from other WordPress users.'),
		link: 'https://facebook.com/groups/1828495198556137',
		linkText: __('Join Now →')
	},
	{
		title: __('Request a Feature'),
		description: __('Have an idea that would make this plugin even better? Let us know — we love hearing from you.'),
		link: 'https://bplugins.com/support/',
		linkText: __('Submit Request →')
	},
	{
		title: __('Loving This Plugin? ⭐'),
		description: __("We're a small team pouring our heart into this plugin — your honest review keeps us going and helps others discover it. It only takes 30 seconds."),
		link: slug ? `https://wordpress.org/support/plugin/${slug}/reviews/#new-post` : '',
		linkText: __('Leave a Review')
	}
];

const Info = ({ slug, pages, helpItems }) => {
	const items = helpItems || defaultHelpItems(slug, pages);

	return <div className='bPlDashboardWelcomeInfo'>
		{items.filter(item => item.link).map((item, index) => <div key={index} className='infoCard bPlDashboardCard'>
			{item.image && <figure>
				<img src={item.image} alt={item.title} />
			</figure>}

			<h4>
				{item.title}
				{item.titleIcon && <span className='titleIcon'>{item.titleIcon}</span>}
			</h4>

			<p>{item.description}</p>

			<Button href={item.link} target='_blank' rel='noopener noreferrer'>{item.linkText}</Button>
		</div>)}
	</div>;
};
export default Info;