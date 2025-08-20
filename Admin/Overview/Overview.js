import Button from '../../Components/Button/Button';

import './style.scss';
import VideoPlayer from './VideoPlayer';

const Overview = (props) => {
	const { name, displayName, description, slug, logo, banner, video, isYoutube, pages, children } = props;

	const helpInfo = [
		{
			title: 'Need any Assistance?',
			description: 'Our Expert Support Team is always ready to help you out promptly.',
			link: 'https://bplugins.com/support',
			linkText: 'Contact Support'
		},
		{
			title: 'Looking for Documentation?',
			description: 'We have detailed documentation on every aspects of the plugin.',
			link: pages?.docs,
			linkText: 'Documentation'
		},
		{
			title: 'Liked This Plugin?',
			description: 'Glad to know that, you can support us by leaving a 5 ⭐ rating.',
			link: `https://wordpress.org/support/plugin/${slug}/reviews#new-post`,
			linkText: 'Rate the Plugin'
		}
	];

	return <div className='bPlDashboardOverview bPlDashboardBox'>
		<div className='overviewLeft'>
			<div className='overviewLeftTop'>
				{name && <h2 className='overviewTitle'>Welcome to {name}</h2>}

				{description && <p className='overviewDescription'>{description}</p>}

				<div className='overviewBanner'>
					{video ?
						<VideoPlayer src={video} width='100%' height='100%' isYoutube={isYoutube} /> :
						(banner ? <img src={banner} alt={`${name} Banner`} /> : null)
					}
				</div>

				<div className='overviewPluginInfo'>
					{logo && <img src={logo} alt={name} />}

					<div>
						{displayName && <h3>{displayName}</h3>}

						<span>by</span>

						<a href='https://bplugins.com' target='_blank' rel='noopener noreferrer'>
							bPlugins
						</a>
					</div>
				</div>
			</div>

			<div className='overviewLeftBottom bPlDashboardButtons'>
				{children}

				{pages?.landing && <Button href={pages.landing} target='_blank' rel='noopener noreferrer' variant='primary'>Learn More</Button>}
			</div>
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