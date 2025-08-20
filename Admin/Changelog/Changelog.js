import { useRef, useState, useEffect } from 'react';

import './style.scss';
import { minusIcon, plusIcon } from '../../utils/icons';

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
								{list?.map((item, token) => <li key={token}>{item}</li>)}
							</ul>
						</div>
					})}
				</div>
			</div>
		</div>
	</div>
};
export default Changelog;
