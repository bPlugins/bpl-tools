/**
 * Overlay Component
 * 
 * @param {object} props - The props object
 * @param {object} props.value - The value of the overlay
 * @param {function} props.onChange - The function to handle changes in the overlay value
 * @param {string} props.device - The device type (e.g., 'desktop', 'tablet', 'mobile')
 * @returns {JSX.Element} React component
 */

import { PanelBody, RangeControl, SelectControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';

import BoxControl from '../BoxControl/BoxControl';
import AdvBackground from '../AdvBackground/AdvBackground';

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

const positionDef = { top: 0, right: 0, bottom: 0, left: 0 }
const OverlayControl = (props) => {
	const { value, onChange } = props;
	const { isEnabled = false, colors = {}, opacity = 1, blend = 'normal', filter = '', blur = 0, brightness = 100, contrast = 100, saturation = 100, hue = 0, position = positionDef, zIndex = -1 } = value || {};

	const updateOverlay = (property, val, childP = null) => {
		const newBG = produce(value || {}, (draft) => {
			if (null !== childP) {
				draft[property][childP] = val;
			} else {
				draft[property] = val;
			}
		});
		onChange(newBG);
	};

	return <PanelBody title='Overlay' className='bPlPanelBody bPlOverlay mt20'>
		<ToggleControl label='Enable' checked={isEnabled} value={isEnabled} onChange={(val) => updateOverlay('isEnabled', val)} __nextHasNoMarginBottom />

		{isEnabled && <>
			<AdvBackground name='Overlay' value={colors} onChange={(val) => updateOverlay('colors', val)} />

			<BoxControl label='Overlay Position' values={position} resetValues={positionDef} onChange={(val) => updateOverlay('position', val)} />

			<RangeControl className='mt20' label='Opacity' value={opacity} onChange={(val) => updateOverlay('opacity', val)} min={0} max={1} step={0.01} />

			<SelectControl className='mt20' label='Blend Mode' labelPosition='left' value={blend} onChange={(val) => updateOverlay('blend', val)} options={blendOptions} />

			<SelectControl className='mt20 mb5' label='CSS Filter' labelPosition='left' value={filter} onChange={(val) => updateOverlay('filter', val)} options={[
				{ label: 'None', value: '' },
				{ label: 'Filter', value: 'filter' },
				{ label: 'Backdrop Filter', value: 'backdrop-filter' }
			]} />

			{filter && <>
				<RangeControl className='mt15' label='Blur' value={blur} onChange={(val) => updateOverlay('blur', val)} min={0} max={20} />

				<RangeControl className='mt15' label='Brightness' value={brightness} onChange={(val) => updateOverlay('brightness', val)} min={0} max={200} />

				<RangeControl className='mt15' label='Contrast' value={contrast} onChange={(val) => updateOverlay('contrast', val)} min={0} max={200} />

				<RangeControl className='mt15' label='Saturation' value={saturation} onChange={(val) => updateOverlay('saturation', val)} min={0} max={200} />

				<RangeControl className='mt15' label='Hue' value={hue} onChange={(val) => updateOverlay('hue', val)} min={0} max={360} />
			</>}
			<NumberControl label="Z Index" labelPosition='edge' value={zIndex} onChange={val => updateOverlay('zIndex', val)} />
		</>}
	</PanelBody>
};
export default OverlayControl;