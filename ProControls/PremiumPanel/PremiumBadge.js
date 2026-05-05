/**
 * PremiumBadge Component
 * 
 * @props label (optional): 'Pro' (String)
 * @props className (optional): (String)
 */

import { __ } from '@wordpress/i18n';

import Badge from '../../Components/Badge';
import { crownIcon } from '../../utils/icons';

const PremiumBadge = ({ label = __('Pro'), className = '' }) => {
	return <Badge className={className} label={label} icon={crownIcon} size='medium' color='#fff' background='#FF7A00' borderColor='#FF7A00' />
}
export default PremiumBadge;