import { useEffect, useState } from 'react';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

import './BoxControl.scss';
import { Label } from '../index';

const BoxControl = (props) => {
	const { label, values = {}, onChange = () => { }, resetValues, defaultValues, units, sides, style, className, disableUnits = false } = props;
	const [link, setLink] = useState(true);

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
		if (!link) {
			onChange({ top: val, right: val, bottom: val, left: val });
		} else {
			if (sides) {
				dimension === 'horizontal' ? onChange({ ...values, right: val, left: val }) : dimension === 'vertical' && onChange({ ...values, top: val, bottom: val })
			} else {
				onChange({ ...values, [dimension]: val });
			}
		}
	};

	useEffect(() => {
		onChange(values);
	}, [values])

	return <div style={{ ...style }} className={`bPlBoxControl ${className}`}>
		{label && <Label className='mb5'>{label}</Label>}

		<div className={`sides ${sides && sides.includes('horizontal', 'vertical') ? 'gap' : ''}`}>
			{unitSides.map((val, i) => <div className='bplUnitControlWrapper' key={i}>
				<UnitControl
					onChange={(v) => handleChange(v, val)}
					value={sides ? val === 'horizontal' ? values?.right : val === 'vertical' && values?.top : values?.[val]}
					defaultValue={defaultValues || null}
					units={units || defaultUnits}
					disableUnits={disableUnits}
				/>
				<div className='sideLabel'>{val}</div>
			</div>)}

			{!sides && <button className='boxLinkButton' onClick={() => setLink(!link)}>
				{link ? <span className='dashicons dashicons-admin-links'></span> : <span className='dashicons dashicons-editor-unlink'></span>}
			</button>}

			{isReset && <button className='boxLinkButton' onClick={() => onChange(resetValues)}>
				<span className='dashicons dashicons-image-rotate'></span>
			</button>}
		</div>
	</div>
};
export default BoxControl;