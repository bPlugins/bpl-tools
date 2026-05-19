import Button from '../../Components/Button/Button';

import { checkIcon } from '../../utils/icons';

import './style.scss';

/**
 * ProAds Component
 * Renders a promotional banner for the Pro version, highlighting key features.
 *
 * @param {object} props - Component props
 * @param {string} props.name - Plugin name
 * @param {object} props.media - Media object containing proThumbnail
 * @param {Array} props.proFeatures - Array of strings describing pro features
 * @returns {JSX.Element}
 */
const ProAds = (props) => {
	const { name, media, proFeatures } = props;
	const { proThumbnail } = media;

	return <div className='bPlDashboardProAds bPlDashboardCard'>
		<div className=''>
			<h3>Go {name} Pro & Unlock More!</h3>

			{proFeatures?.length && <ul>
				{proFeatures?.map((f, i) => <li key={i}>
					<span>{checkIcon}</span>
					{f}
				</li>)}
			</ul>}

			<Button href='#pricing'>View Pricing Plan</Button>
		</div>

		{proThumbnail && <figure>
			<img src={proThumbnail} alt={`${name} Pro features`} />
		</figure>}
	</div>
}
export default ProAds;