/**
 * @props className (optional): 'mt20' (String)
 * @props label: 'Border Settings' (String)
 * @props border: { width, style, color, side, radius } (Object)
 * @props onChange: (Function)
 * @props defaults (optional): { width, style, color, side, radius } (Object)
 * @return Border Properties (Object)
 */

import { __ } from '@wordpress/i18n';
import { Dropdown, PanelRow, SelectControl, __experimentalUnitControl as UnitControl, Button } from '@wordpress/components';
import { useState } from 'react';

import Label from '../../Label/Label';
import { ColorControl } from '../../ColorControl/ColorControl';
import { borderStyles, pxUnit, perUnit, emUnit, remUnit, sides } from '../../../utils/options';

const BorderControl = props => {
	const { className = '', label = __('Border:'), value, onChange, defaults = {} } = props;
	const [radiusLinked, setRadiusLinked] = useState(true);

	const defaultVal = { width: '0px', style: 'solid', color: '', side: 'all', radius: '0px 0px 0px 0px' };

	const parseRadius = (radiusVal) => {
		if (!radiusVal) return ['0px', '0px', '0px', '0px'];
		const parts = radiusVal.trim().split(/\s+/);
		if (parts.length === 4) return parts;
		if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
		return ['0px', '0px', '0px', '0px'];
	};

	const joinRadius = (radiusArray) => {
		return radiusArray.join(' ');
	};

	const getDefault = property => defaults?.[property] || defaultVal[property];
	const setDefault = property => onChange({ ...value, [property]: getDefault(property) });

	const getValue = property => value?.[property] || getDefault(property);
	const setValue = (property, val) => onChange({ ...value, [property]: val });
	const resetValue = property => <Button icon='image-rotate' className='bPlResetVal' onClick={() => setDefault(property)} />

	const handleRadiusChange = (val, corner) => {
		const currentRadius = parseRadius(getValue('radius'));
		const cornerIndex = { 'topLeft': 0, 'topRight': 1, 'bottomRight': 2, 'bottomLeft': 3 };

		if (radiusLinked) {
			setValue('radius', joinRadius([val, val, val, val]));
		} else {
			currentRadius[cornerIndex[corner]] = val;
			setValue('radius', joinRadius(currentRadius));
		}
	};

	const radiusValues = parseRadius(getValue('radius'));
	const defaultRadiusValues = parseRadius(getDefault('radius'));
	const isRadiusReset = radiusValues.every((val, i) => val === defaultRadiusValues[i]);

	const radiusCorners = [
		{ key: 'topLeft', index: 0, label: __('Top-left') },
		{ key: 'topRight', index: 1, label: __('Top-right') },
		{ key: 'bottomRight', index: 2, label: __('Bottom-right') },
		{ key: 'bottomLeft', index: 3, label: __('Bottom-left') },
	];

	return <PanelRow className={`bPlDropdown ${className}`}>
		<Label className='mt5'>{label}</Label>

		<Dropdown className='bPlDropdownContainer' contentClassName='bPlDropdownPopover' popoverProps={{ placement: 'bottom-end' }}
			renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
			renderContent={() => <>
				<PanelRow>
					<UnitControl label={__('Width:')} labelPosition='left' value={getValue('width')} onChange={val => setValue('width', val)} units={[pxUnit(), emUnit()]} />
					{value?.width && value?.width !== getDefault('width') && resetValue('width')}
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Style:')}</Label>
					<SelectControl value={getValue('style')} onChange={val => setValue('style', val)} options={borderStyles} />
					{value?.style && value?.style !== getDefault('style') && resetValue('style')}
				</PanelRow>

				<ColorControl label={__('Color:')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />

				<PanelRow>
					<Label className=''>{__('Sides:')}</Label>
					<SelectControl value={getValue('side')} onChange={val => setValue('side', val)} options={sides} />
					{value?.side && value?.side !== getDefault('side') && resetValue('side')}
				</PanelRow>

				<div className='bPlBoxControl mt20'>
					<Label className=''>{__('Radius:')}</Label>

					<div className='sides'>
						{radiusCorners.map(corner => <div className='bplUnitControlWrapper' key={corner.key}>
							<UnitControl
								onChange={(v) => handleRadiusChange(v, corner.key)}
								value={radiusValues[corner.index]}
								units={[pxUnit(50), perUnit(50), emUnit(3), remUnit(3)]}
								isResetValueOnUnitChange={true}
							/>
							{/* <div className='sideLabel'>{corner.label}</div> */}
						</div>)}

						<button className={`bplBoxControlLinkButton ${radiusLinked ? 'activeLink' : ''}`} onClick={() => setRadiusLinked(!radiusLinked)}>
							{radiusLinked ? <span className='dashicons dashicons-admin-links'></span> : <span className='dashicons dashicons-editor-unlink'></span>}
						</button>

						{!isRadiusReset && <button className='bplBoxControlLinkButton' onClick={() => setDefault('radius')}>
							<span className='dashicons dashicons-image-rotate'></span>
						</button>}
					</div>
				</div>
			</>}
		/>
	</PanelRow>
};
export default BorderControl;
