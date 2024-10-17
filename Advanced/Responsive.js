import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { updateData } from '../utils/functions';

const Responsive = ({ responsive, onChange }) => {
	const { desktop = false, tablet = false, mobile = false } = responsive || {};

	return <PanelBody className='bPlPanelBody' title='Responsive Control' initialOpen={false}>
		<ToggleControl label='Hide on Desktop' checked={desktop} onChange={val => onChange(updateData(responsive, val, 'desktop'))} />

		<ToggleControl className='mt15' label='Hide on Tablet' checked={tablet} onChange={val => onChange(updateData(responsive, val, 'tablet'))} />

		<ToggleControl className='mt15' label='Hide on Mobile' checked={mobile} onChange={val => onChange(updateData(responsive, val, 'mobile'))} />
	</PanelBody>
}
export default Responsive;