/**
	* Changelog Component
	*
	* @props slug (required): WordPress.org slug - builds the read-more link (String)
	* @props changelogs (required): [{type, version, list}] changelog entries (Array)
	* @props limit (optional): 5 - max entries shown (Number)
	* @props loadMoreLabel (optional): read-more button text; omit to hide (String)
	*/

import Button from '../../../Components/Button/Button';
import './style.scss';

const BADGE_MAP = {
	new: 'new', add: 'new',
	update: 'update',
	improve: 'improvement', improvement: 'improvement',
	fix: 'fix', fixing: 'fix', fixed: 'fix', remove: 'fix',
};

const processItem = (html) => html.replace(
	/^<strong>([^<]+)<\/strong>/i,
	(_, label) => {
		const clean = label.replace(':', '').trim();
		const cls = BADGE_MAP[clean.toLowerCase()] || 'default';
		return `<strong class="changelogBadge ${cls}">${clean}</strong>`;
	}
);

const Changelog = (props) => {
	const { slug, changelogs, limit = 5, loadMoreLabel } = props;

	return changelogs?.length && <div className='bPlDashboardChangelog bPlDashboardCard'>
		<h3>Release Notes(Changelog)...</h3>

		<div className='allChangelogs'>
			{changelogs?.slice(0, limit)?.map((changelog, index) => {
				const { type, version, list } = changelog;

				return <div key={index} className={`changelog ${type}`}>
					<ul className='list'>
						{list?.map((item, token) => <li key={token} dangerouslySetInnerHTML={{ __html: processItem(item) }} />)}
					</ul>

					<p className='time'>{version}</p>
				</div>
			})}
		</div>

		{loadMoreLabel && <>
			<br />
			<Button className='mt20' target='_blank' rel='noopener noreferrer' href={`https://wordpress.org/plugins/${slug}/#developers`}>{loadMoreLabel}</Button>
		</>}
	</div>
};
export default Changelog;
