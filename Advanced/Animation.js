import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

import { updateData } from '../utils/functions';
import { animationTypes } from '../utils/options';

const Animation = ({ animation, onChange, id, isPremium }) => {
	const { type = '', duration = 1, delay = 0 } = animation || {};

	// const element = document.getElementById(id);
	// useEffect(() => {
	// 	if (element) {
	// 		element.classList.remove('aos-init');
	// 		element.classList.remove('aos-animate');
	// 		// element.setAttribute('data-aos', type);
	// 		// element.setAttribute('data-aos-duration', duration);
	// 		// element.setAttribute('data-aos-delay', delay);

	// 		setTimeout(() => {
	// 			element.classList.add('aos-init');
	// 			element.classList.add('aos-animate');
	// 		}, 500);
	// 	}
	// }, [type, duration, delay]);

	return <PanelBody className='bPlPanelBody' title='Animation'>
		<SelectControl label={__('Type')} labelPosition='left' value={type} onChange={val => onChange(updateData(animation, val, 'type'))} options={animationTypes} />

		<RangeControl className='mt20' label='Duration (s)' value={duration} onChange={val => onChange(updateData(animation, val, 'duration'))} min={0} max={3} step={0.05} />

		<RangeControl className='mt20' label='Delay (s)' value={delay} onChange={val => onChange(updateData(animation, val, 'delay'))} min={0} max={3} step={0.05} />
	</PanelBody>
}
export default Animation;