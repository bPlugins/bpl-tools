/**
 * @props className (optional): 'mt20' (String)
 * @props label (optional): 'Typography' (String)
 * @props colors (required): { color, bgType, bg, gradient } (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { color, bgType, bg, gradient } (Object)
 */

import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { Button, PanelRow, Dropdown, __experimentalGradientPicker, GradientPicker, ColorIndicator } from '@wordpress/components';
const Gradient = __experimentalGradientPicker || GradientPicker;

// Variables
import { Label, BtnGroup, ColorControl } from '../index';
import { bgTypes } from '../../utils/options';
import { gradient } from '../../utils/data';

const ColorsControl = props => {
	const { className = '', label = __('Colors:'), value, onChange, defaults = {}, gradients } = props;

	const defaultVal = { color: '#333', bgType: 'solid', bg: '', gradient }

	const getDefault = property => defaults?.[property] || defaultVal[property];

	const getValue = property => value?.[property] || getDefault(property);
	const setValue = (property, val) => onChange({ ...value, [property]: val });

	return <PanelRow className={`bPlDropdown ${className}`}>
		<Label className=''>{label} <ColorIndicator colorValue={getValue('color')} /> <ColorIndicator colorValue={getValue('gradient' === getValue('bgType') ? 'gradient' : 'bg')} /></Label>

		<Dropdown className='bPlDropdownContainer' contentClassName='bPlDropdownPopover' popoverProps={{ placement: 'bottom-end' }}
			renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
			renderContent={() => <>
				<ColorControl label={__('Color:')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />

				<PanelRow className='mt20'>
					<Label className=''>{__('Background:')}</Label>
					<BtnGroup value={getValue('bgType')} onChange={val => setValue('bgType', val)} options={bgTypes} size='small' />
				</PanelRow>

				{'gradient' === getValue('bgType') ? <Gradient value={getValue('gradient')} onChange={val => setValue('gradient', val)} gradients={gradients} /> : <ColorControl label={__('Background Color:')} value={getValue('bg')} onChange={val => setValue('bg', val)} defaultColor={getDefault('bg')} />}
			</>}
		/>
	</PanelRow>
}
export default withSelect((select) => {
	const { gradients } = select('core/block-editor').getSettings();

	return {
		gradients: gradients.length > 12 ? gradients.slice(0, 12) : gradients
	};
})(ColorsControl);