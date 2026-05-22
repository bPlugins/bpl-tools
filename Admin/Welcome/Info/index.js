import Button from '../../../Components/Button/Button';
import { facebookIcon } from '../../utils/icons';

import './style.scss';

const defaultHelpItems = (slug, pages) => [
	{
		title: 'Need any Assistance?',
		description: 'Our Expert Support Team is always ready to help you out promptly.',
		link: 'https://bplugins.com/support',
		linkText: 'Contact Support'
	},
	{
		titleIcon: facebookIcon,
		title: 'Join Our Community',
		description: 'Get tutorials, plugin updates, feature announcements, and support from other WordPress users.',
		link: 'https://facebook.com/groups/1828495198556137',
		linkText: 'Join Now →'
	},
	{
		title: 'Request a Feature',
		description: 'Have an idea that would make this plugin even better? Let us know — we love hearing from you.',
		link: 'https://bplugins.com/support/',
		linkText: 'Submit Request →'
	},
	{
		title: 'Loving This Plugin? ⭐',
		description: "We're a small team pouring our heart into this plugin — your honest review keeps us going and helps others discover it. It only takes 30 seconds.",
		link: slug ? `https://wordpress.org/support/plugin/${slug}/reviews/#new-post` : '',
		linkText: 'Leave a Review'
	}
];

/**
 * Info — help cards row shown at the bottom of the Welcome page.
 *
 * @param {object}    props
 * @param {string}    props.slug
 * @param {object}    props.pages
 * @param {object[]}  [props.helpItems] - Override default items. Each: {image?, titleIcon?, title, description, link, linkText}
 */
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
