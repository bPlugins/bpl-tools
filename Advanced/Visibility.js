import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { PanelBody, PanelRow, SelectControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label, Device } from '../Components';
import { updateData } from '../utils/functions';
import { overflows } from '../utils/options';

const Visibility = ({ visibility, onChange, enabled, device }) => {
	const { zIndex = {}, overflow = '' } = visibility || {};

	const isEnabled = (which) => enabled.includes(which);

	return <PanelBody className='bPlPanelBody' title='Visibility' initialOpen={false}>
		{isEnabled('zIndex') && <>
			<PanelRow className='mb5'>
				<Label className=''>Z Index</Label>
				<Device />
			</PanelRow>
			<NumberControl value={zIndex[device]} onChange={val => onChange(updateData(visibility, val, 'zIndex', device))} />
		</>}

		{isEnabled('overflow') && <SelectControl className='mt20' label={__('Overflow')} labelPosition='left' value={overflow} onChange={val => onChange(updateData(visibility, val, 'overflow'))} options={overflows} />}
	</PanelBody>
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Visibility);