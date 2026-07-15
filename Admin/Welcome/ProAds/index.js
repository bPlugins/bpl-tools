import Button from '../../../Components/Button/Button';
import { checkIcon } from '../../utils/icons';

import './style.scss';

/**
 * ProAds — upgrade prompt shown to free users on the Welcome page.
 *
 * @param {object}		props
 * @param {string}		props.name
 * @param {object}		props.media			- {proThumbnail}
 * @param {string[]}	props.proFeatures
 */
const ProAds = (props) => {
	const { name, media, proFeatures } = props;
	const { proThumbnail } = media || {};

	return <div className='bPlDashboardWelcomeProAds bPlDashboardCard'>
		<div className='content'>
			<h3>Go {name} Pro & Unlock More!</h3>

			{proFeatures?.length > 0 && <ul>
				{proFeatures.map((f, i) => <li key={i}>
					<span>{checkIcon}</span>
					{f}
				</li>)}
			</ul>}

			<Button href='#pricing'>View Pricing Plan</Button>
		</div>

		{proThumbnail && <figure>
			<img src={proThumbnail} alt={`${name} Pro features`} />
		</figure>}
	</div>;
};

export default ProAds;
