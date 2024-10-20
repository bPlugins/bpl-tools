import { withSelect } from '@wordpress/data';
import { PanelBody, PanelRow } from '@wordpress/components';

import { Label, Device, BoxControl } from '../Components';
import { updateData } from '../utils/functions';

const Dimension = ({ dimension, onChange, enabled, device }) => {
	const { padding = {}, margin = {} } = dimension || {};

	const isEnabled = (which) => enabled.includes(which);

	return <PanelBody className='bPlPanelBody' title='Dimension'>
		{isEnabled('padding') && <>
			<PanelRow className='mb5'>
				<Label className=''>Padding</Label>
				<Device />
			</PanelRow>

			<BoxControl values={padding[device]} onChange={val => onChange(updateData(dimension, val, 'padding', device))} />
		</>}

		{isEnabled('margin') && <>
			<PanelRow className='mt20 mb5'>
				<Label className=''>Margin</Label>
				<Device />
			</PanelRow>

			<BoxControl values={margin[device]} onChange={val => onChange(updateData(dimension, val, 'margin', device))} />
		</>}
	</PanelBody>
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Dimension);