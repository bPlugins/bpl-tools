/**
	* AdvertiseCard Component
	*
	* @props className (optional): '' (String)
	* @props isPremium (optional): false (Boolean)
	* @props planLink (optional): 'https://bplugins.com/pricing/' (String)
	* @props supportLink (optional): 'https://bplugins.com/support/' (String)
	*/

import { __ } from '@wordpress/i18n';

import Button from '../../Components/Button/Button';

import './style.scss';

export const AdvertiseCard = ({ className = '', isPremium = false, planLink = 'https://bplugins.com/pricing/', supportLink = 'https://bplugins.com/support/' }) => {
	return <div className={`bPlAdvertiseCard ${className} ${isPremium ? 'support' : 'getPro'}`}>
		{isPremium ? <>
			<h4>{__('Stuck!! Get Support')}</h4>
			<p>{__('If you are facing any issues, please contact us.')}</p>

			<Button variant='primary' href={supportLink} target='_blank' rel='noopener noreferrer'>
				{__('Get Support')}
			</Button>
		</> : <>
			<div className='badge'>{__('Recommended')}</div>

			<h4>{__('Go for Pro Plan')}</h4>
			<p>{__('Remove barriers and unlock premium features.')}</p>

			<Button variant='primary' href={planLink} target='_blank' rel='noopener noreferrer'>
				{__('Get Pro Access')}
			</Button>
		</>}
	</div>
};
export default AdvertiseCard;