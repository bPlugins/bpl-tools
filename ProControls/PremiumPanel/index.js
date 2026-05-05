/**
 * PremiumPanel Component
 * 
 * @props title (optional): (String)
 * @props description (optional): (String)
 * @props pricingUrl (required): (String)
 * @props demoUrl (optional): (String)
 * @props buttonLabel (optional): 'Get Pro' (String)
 */

import { __ } from '@wordpress/i18n';

import Button from '../../Components/Button/Button';
import { crownIcon, externalIcon } from '../../utils/icons';

import './style.scss';

const PremiumPanel = ({ title, description, pricingUrl, demoUrl = '', buttonLabel = __('Get Pro'), children }) => {
	return <div className='bPlPremiumPanel'>
		<div className='icon'>{crownIcon}</div>

		{title && <h3 className={demoUrl ? 'hasDemo' : ''}>
			{demoUrl ? <>
				<a href={demoUrl} target='_blank' rel='noopener noreferrer'>
					{title}
					{externalIcon}
				</a>
			</> :
				title}
		</h3>}

		{description && <p>{description}</p>}

		{children}

		<Button href={pricingUrl} variant='secondary' size='medium' target='_blank' rel='noopener noreferrer'>{crownIcon} {buttonLabel}</Button>
	</div>
}
export default PremiumPanel;