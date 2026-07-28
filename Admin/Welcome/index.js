import './style.scss';

import Overview from './Overview';
import GettingStarted from './GettingStarted';
import ProAds from './ProAds';
import Changelog from './Changelog';
import Info from './Info';

/**
 * Full Welcome page — composes Overview, GettingStarted, Changelog, ProAds, and Info.
 *
 * Spread both `dashboardInfo` and `welcomeInfo(adminUrl)` as props:
 *	<Welcome {...props} {...welcomeInfo(adminUrl)} />
 *
 * @param {object}		props
 * @param {string}		props.name
 * @param {string}		props.version
 * @param {string}		props.description
 * @param {boolean}		props.isPremium
 * @param {string}		props.slug						- WordPress.org slug (for review link)
 * @param {object}		props.media						- {logo, thumbnail, proThumbnail?, video?, isYoutube?}
 * @param {object}		props.pages						- {org?, docs?, pricing?, landing?}
 * @param {object}		[props.startButton]				- {label, url}
 * @param {string[]}	[props.keywords]				- Chip labels in the hero card (e.g. ['Grid', 'Masonry'])
 * @param {string}		[props.keywordsLabel]			- Label before keyword chips (e.g. 'Layouts')
 * @param {object}		[props.gettingStarted]			- {tabs: [{key, label, icon?, video?, isYoutube?, videoLabel?, steps}]} — omit to hide
 * @param {object[]}	[props.changelogs]				- [{version, type, list}] — omit to hide Changelog panel
 * @param {number}		[props.changelogsLimit]			- Max entries shown initially (default 5)
 * @param {string}		[props.changelogsReadMoreLabel]	- "Read more" button text; omit to hide
 * @param {string[]}	[props.proFeatures]				- Pro feature bullets shown in ProAds (free users only)
 * @param {object[]}	[props.helpItems]				- Override Info panel cards
 */
const Welcome = (props) => {
	const { isPremium, gettingStarted, pages, changelogsLimit, changelogsReadMoreLabel } = props;
	const hasTabs = gettingStarted?.tabs?.length > 0;

	return <div className='bPlDashboardWelcome'>
		<div className={`heroRow ${hasTabs ? '' : 'singleCol'}`}>
			<Overview {...props} />

			{hasTabs && <GettingStarted {...gettingStarted} pages={pages} />}
		</div>

		<div className='contentRow'>
			<Changelog {...props} limit={changelogsLimit} loadMoreLabel={changelogsReadMoreLabel} />

			{!isPremium ?
				<ProAds {...props} /> :
				<Info {...props} />}
		</div>

		{!isPremium && <Info {...props} />}
	</div>;
};
export { Overview, GettingStarted, ProAds, Changelog, Info };
export default Welcome;