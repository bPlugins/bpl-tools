/**
	* Changelog Component
	*
	* @props changelogs (required): List of release notes, each with version and list (Array)
	*/

import { useRef, useState, useEffect } from 'react';

import './style.scss';
import { minusIcon, plusIcon } from '../../utils/icons';

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
	const { changelogs } = props;

	const [isChangelogs, setIsChangelogs] = useState(false);
	const changelogsWrapRef = useRef();
	const changelogsRef = useRef();

	useEffect(() => {
		const wrap = changelogsWrapRef.current;
		const inner = changelogsRef.current;

		if (wrap && inner) {
			if (isChangelogs) {
				wrap.style.height = `${inner.scrollHeight}px`;
			} else {
				wrap.style.height = '0px';
			}
		}
	}, [isChangelogs, changelogs]);

	return changelogs?.length && <div className='bPlDashboardChangelog bPlDashboardBox'>
		<div className='toggleArea'>
			<h2 className='headerArea' onClick={() => setIsChangelogs(!isChangelogs)}>
				Release Notes(Changelog)...

				{isChangelogs ? minusIcon : plusIcon}
			</h2>

			<div className='changelogsWrap' ref={changelogsWrapRef} style={{ height: 0 }}>
				<div className='changelogs' ref={changelogsRef}>
					{changelogs.map((changelog, index) => {
						const { version, list } = changelog;

						return <div key={index} className='item'>
							<h4>{version}</h4>

							<ul className='list'>
								{list?.map((item, token) => <li key={token} dangerouslySetInnerHTML={{ __html: processItem(item) }} />)}
							</ul>
						</div>
					})}
				</div>
			</div>
		</div>
	</div>
};
export default Changelog;
