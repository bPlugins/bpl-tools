/**
 * @props className (optional): 'mt20' (String)
 * @props label: 'Box Shadow' (String)
 * @props shadow: { hOffset, vOffset, blur, spreed, color, isInset } (Object)
 * @props onChange: (Function)
 * @props defaults (optional): { hOffset, vOffset, blur, spreed, color, isInset } (Object)
 * @return Shadow Properties (Object)
 */

import { __ } from '@wordpress/i18n';
import { Dropdown, PanelRow, __experimentalUnitControl as UnitControl, Button, ToggleControl } from '@wordpress/components';

import { Label, ColorControl } from '../../index';
import { pxUnit, emUnit, remUnit } from '../../../utils/options';

const ShadowControl = props => {
	const { className = '', label = __('Shadow'), value, onChange, defaults = {}, type = 'box' } = props;

	const defaultVal = { hOffset: '0px', vOffset: '0px', blur: '0px', spreed: '0px', color: '#7090b0', isInset: false }

	const getDefault = property => defaults?.[property] || defaultVal[property];
	const setDefault = property => onChange({ ...value, [property]: getDefault(property) });

	const getValue = property => value?.[property] || getDefault(property);
	const setValue = (property, val) => onChange({ ...value, [property]: val });
	const resetValue = property => <Button icon='image-rotate' className='bPlResetVal' onClick={() => setDefault(property)} />

	return <PanelRow className={`bPlDropdown ${className}`}>
		<Label className='mt5'>{label}</Label>

		<Dropdown className='bPlDropdownContainer' contentClassName='bPlDropdownPopover' popoverProps={{ placement: 'bottom-end' }}
			renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
			renderContent={() => <>
				<PanelRow>
					<UnitControl label={__('Horizontal Offset:')} labelPosition='left' value={getValue('hOffset')} onChange={val => setValue('hOffset', val)} units={[pxUnit(), emUnit(), remUnit()]} />
					{value?.hOffset && value?.hOffset !== getDefault('hOffset') && resetValue('hOffset')}
				</PanelRow>

				<PanelRow>
					<UnitControl label={__('Vertical Offset:')} labelPosition='left' value={getValue('vOffset')} onChange={val => setValue('vOffset', val)} units={[pxUnit(), emUnit(), remUnit()]} />
					{value?.vOffset && value?.vOffset !== getDefault('vOffset') && resetValue('vOffset')}
				</PanelRow>

				<PanelRow>
					<UnitControl label={__('Blur:')} labelPosition='left' value={getValue('blur')} onChange={val => setValue('blur', val)} units={[pxUnit(), emUnit(), remUnit()]} />
					{value?.blur && value?.blur !== getDefault('blur') && resetValue('blur')}
				</PanelRow>
				<small>{__('Blur cannot be negative value!')}</small>

				{'box' === type && <PanelRow>
					<UnitControl label={__('Spreed:')} labelPosition='left' value={getValue('spreed')} onChange={val => setValue('spreed', val)} units={[pxUnit(), emUnit(), remUnit()]} />
					{value?.spreed && value?.spreed !== getDefault('spreed') && resetValue('spreed')}
				</PanelRow>}

				<ColorControl label={__('Color:')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />

				{'box' === type && <ToggleControl className='mt20' label={__('Shadow Inset?')} checked={getValue('isInset')} onChange={val => setValue('isInset', val)} />}
			</>}
		/>
	</PanelRow>
};
export default ShadowControl;