import Button from '../../Components/Button/Button';
import './style.scss';

/**
 * Changelog Component
 * Renders the release notes/changelog section from a provided array.
 *
 * @param {object} props - Component props
 * @param {Array} props.changelogs - Array of changelog objects {type, version, list}
 * @returns {JSX.Element}
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
