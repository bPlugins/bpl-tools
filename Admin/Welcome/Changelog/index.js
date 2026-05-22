import Button from '../../../Components/Button/Button';
import './style.scss';

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

		{changelogs?.slice(0, limit)?.map((changelog, index) => {
			const { type, version, list } = changelog;

			return <div key={index} className={`changelog ${type}`}>
				<ul className='list'>
					{list?.map((item, token) => <li key={token}>{item}</li>)}
				</ul>

				<p className='time'>{version}</p>
			</div>
		})}

		{loadMoreLabel && <>
			<br />
			<Button className='mt20' target='_blank' rel='noopener noreferrer' href={`https://wordpress.org/plugins/${slug}/#developers`}>{loadMoreLabel}</Button>
		</>}
	</div>
};
export default Changelog;
