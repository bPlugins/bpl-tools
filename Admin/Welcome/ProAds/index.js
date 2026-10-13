import { __, sprintf } from '@wordpress/i18n';

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
			<h3>{sprintf(
				/* translators: %s: Plugin name. */
				__('Go %s Pro & Unlock More!'),
				name
			)}</h3>

			{proFeatures?.length > 0 && <ul>
				{proFeatures.map((f, i) => <li key={i}>
					<span>{checkIcon}</span>
					{f}
				</li>)}
			</ul>}

			<Button href='#pricing'>{__('View Pricing Plan')}</Button>
		</div>

		{proThumbnail && <figure>
			<img src={proThumbnail} alt={sprintf(
				/* translators: %s: Plugin name. */
				__('%s Pro features'),
				name
			)} />
		</figure>}
	</div>;
};
export default ProAds;