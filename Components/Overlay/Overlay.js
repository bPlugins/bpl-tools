import { useState } from 'react';
import { RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import { produce } from 'immer';

import { advBgOptions } from '../../utils/options';
import { AdvBackground } from '../AdvBackground/AdvBackground';

const blendOptions = [
	{ label: 'Normal', value: 'normal' },
	{ label: 'Multiply', value: 'multiply' },
	{ label: 'Screen', value: 'screen' },
	{ label: 'Overlay', value: 'overlay' },
	{ label: 'Darken', value: 'darken' },
	{ label: 'Lighten', value: 'lighten' },
	{ label: 'Color Dodge', value: 'color-dodge' },
	{ label: 'Saturation', value: 'saturation' },
	{ label: 'Color', value: 'color' },
	{ label: 'Luminosity', value: 'luminosity' },
];

/**
 * Overlay Component
 * 
 * @param {object} props - The props object
 * @param {object} props.value - The value of the overlay
 * @param {function} props.onChange - The function to handle changes in the overlay value
 * @param {string} props.device - The device type (e.g., 'desktop', 'tablet', 'mobile')
 * @returns {JSX.Element} React component
 */


export const Overlay = (props) => {
	const { value, onChange, device } = props;
	const [overlay, setOverlay] = useState(value || {
		isEnabled: false,
		colors: advBgOptions,
		opacity: 1,
		blend: 'normal',
		isCssFilter: false,
		blur: 0,
		brightness: 100,
		contrast: 100,
		saturation: 100,
		hue: 0,
	});

	const {
		isEnabled = false,
		colors = advBgOptions,
		opacity = 1,
		blend = 'normal',
		isCssFilter = false,
		blur = 0,
		brightness = 100,
		contrast = 100,
		saturation = 100,
		hue = 0,
	} = overlay;
	const updateOverlay = (property, value, childP = null) => {
		const newBG = produce(overlay, (draft) => {
			if (null !== childP) {
				draft[property][childP] = value;
			} else {
				draft[property] = value;
			}
		});
		setOverlay(newBG);
		onChange(newBG);
	};
	return <div className='bPlOverlay mt20'>
		<ToggleControl
			label='Enable Overlay'
			checked={isEnabled}
			value={isEnabled}
			onChange={(val) => updateOverlay('isEnabled', val)}
		/>

		{isEnabled && <>
			<AdvBackground
				name='Overlay'
				value={colors}
				device={device}
				onChange={(val) => updateOverlay('colors', val)}
			/>
			<hr />

			<RangeControl
				className='mt20'
				label='Opacity'
				min={0}
				max={1}
				value={opacity}
				step={0.01}
				onChange={(val) => updateOverlay('opacity', val)}
			/>

			<SelectControl
				className='mt20'
				label='Blend Mode'
				labelPosition='left'
				options={blendOptions}
				value={blend}
				onChange={(val) => updateOverlay('blend', val)}
			/>

			<ToggleControl
				className='mt20'
				label='CSS Filters'
				checked={isCssFilter}
				value={isCssFilter}
				onChange={(val) => updateOverlay('isCssFilter', val)}
			/>
			{isCssFilter && <>
				<RangeControl
					className='mt15'
					label='Blur'
					min={0}
					max={10}
					value={blur}
					onChange={(val) => updateOverlay('blur', val)}
				/>
				<RangeControl
					className='mt15'
					label='Brightness'
					min={0}
					max={200}
					value={brightness}
					onChange={(val) => updateOverlay('brightness', val)}
				/>
				<RangeControl
					className='mt15'
					label='Contrast'
					min={0}
					max={200}
					value={contrast}
					onChange={(val) => updateOverlay('contrast', val)}
				/>
				<RangeControl
					className='mt15'
					label='Saturation'
					min={0}
					max={200}
					value={saturation}
					onChange={(val) => updateOverlay('saturation', val)}
				/>
				<RangeControl
					className='mt15'
					label='Hue'
					min={0}
					max={360}
					value={hue}
					onChange={(val) => updateOverlay('hue', val)}
				/>
			</>}
		</>}
	</div>
};

export default Overlay;
