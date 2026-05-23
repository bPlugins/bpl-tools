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

/**
 * Release notes panel — renders changelog entries with a configurable display limit.
 *
 * @param {object}   props
 * @param {string}   props.slug              - WordPress.org slug — builds the read-more link
 * @param {object[]} props.changelogs        - [{type: 'new'|'update'|'fix', version: string, list: string[]}]
 * @param {number}   [props.limit]           - Max entries shown (default 5). Pass as changelogsLimit via Welcome.
 * @param {string}   [props.loadMoreLabel]   - "Read more" button text; omit to hide. Pass as changelogsReadMoreLabel via Welcome.
 */
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
