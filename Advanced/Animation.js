import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

import { updateData } from '../utils/functions';
import { animationTypes } from '../utils/options';

const Animation = ({ animation, onChange }) => {
	const { type = '', duration = 1, delay = 0 } = animation || {};

	return <PanelBody className='bPlPanelBody' title='Animation'>
		<SelectControl label={__('Type')} labelPosition='left' value={type} onChange={val => onChange(updateData(animation, val, 'type'))} options={animationTypes} />

		<RangeControl className='mt20' label='Duration (s)' value={duration} onChange={val => onChange(updateData(animation, val, 'duration'))} min={0} max={3} step={0.05} />

		<RangeControl className='mt20' label='Delay (s)' value={delay} onChange={val => onChange(updateData(animation, val, 'delay'))} min={0} max={3} step={0.05} />
	</PanelBody>
}
export default Animation;