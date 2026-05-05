import { __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useState } from 'react';

import { Label } from '../index';
import './BoxControl.scss';

/**
 * BoxControl Component
 * @param {Object} props
 * @param {string} [props.label] - Label text for the control
 * @param {Object} [props.values={}] - Values object containing top, right, bottom, left measurements
 * @param {Function} [props.onChange=()=>{}] - Callback function when values change
 * @param {Object} [props.resetValues] - Default values to reset to
 * @param {Array} [props.units] - Array of unit objects [{label: string, value: string}]
 * @param {Array} [props.sides] - Array of sides to show ('horizontal', 'vertical' or ['top', 'right', 'bottom', 'left'])
 * @param {Object} [props.style] - Custom styles for the container
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.disableUnits=false] - Whether to disable unit selection
 */

const BoxControl = (props) => {
	const { label, values = {}, onChange = () => { }, resetValues, units, sides, style, className = '', disableUnits = false } = props;
	const [link, setLink] = useState(false);

	const unitSides = sides || ['top', 'right', 'bottom', 'left'];

	const resetOption = resetValues && Object.keys(resetValues).map((key) => {
		let isReset = false;
		if (Object.keys(values) && resetValues[key] !== values[key]) {
			isReset = false;
		} else {
			isReset = true;
		}
		return isReset
	});

	const isReset = resetValues && resetOption.includes(false) && Object.keys(values)?.length > 0;
	const defaultUnits = [
		{ label: 'px', value: 'px' },
		{ label: '%', value: '%' },
		{ label: 'em', value: 'em' },
		{ label: 'rem', value: 'rem' },
		{ label: 'vw', value: 'vw' },
		{ label: 'vh', value: 'vh' },
	];

	const handleChange = (val, dimension) => {
		if (link) {
			onChange({ top: val, right: val, bottom: val, left: val });
		} else {
			if (sides) {
				dimension === 'horizontal' ? onChange({ ...values, right: val, left: val }) : dimension === 'vertical' && onChange({ ...values, top: val, bottom: val })
			} else {
				onChange({ ...values, [dimension]: val });
			}
		}
	}

	return <div style={{ ...style }} className={`bPlBoxControl ${className}`}>
		{label && <Label className='mb5'>{label}</Label>}

		<div className={`sides ${sides && sides.includes('horizontal', 'vertical') ? 'gap' : ''}`}>
			{unitSides.map((val, i) => <div className='bplUnitControlWrapper' key={i}>
				<UnitControl
					onChange={(v) => handleChange(v, val)}
					value={sides ? val === 'horizontal' ? values?.right : val === 'vertical' && values?.top : values?.[val]}
					units={units || defaultUnits}
					disableUnits={disableUnits}
					__next40pxDefaultSize
				/>
				<div className='sideLabel'>{val}</div>
			</div>)}

			{!sides && <button className={`bplBoxControlLinkButton ${link ? 'activeLink' : ''}`} onClick={() => setLink(!link)}>
				{link ? <span className='dashicons dashicons-admin-links'></span> : <span className='dashicons dashicons-editor-unlink'></span>}
			</button>}

			{isReset && <button className='bplBoxControlLinkButton' onClick={() => onChange(resetValues)}>
				<span className='dashicons dashicons-image-rotate'></span>
			</button>}
		</div>
	</div>
}
export default BoxControl;