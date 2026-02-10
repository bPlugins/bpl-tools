import './style.scss';

const Changelog = (props) => {
	const { changelogs } = props;

	return changelogs?.length && <div className='bPlDashboardChangelog bPlDashboardCard'>
		<h3>Release Notes(Changelog)...</h3>

		{changelogs?.slice(0, 5)?.map((changelog, index) => {
			const { type, version, list } = changelog;

			return <div key={index} className={`changelog ${type}`}>
				<ul className='list'>
					{list?.map((item, token) => <li key={token}>{item}</li>)}
				</ul>

				<p className='time'>{version}</p>
			</div>
		})}
	</div>
};
export default Changelog;
