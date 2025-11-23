import { Button, Dashicon, __experimentalNumberControl as NumberControl, RangeControl, Tooltip } from '@wordpress/components';
import { produce } from 'immer';
import { useEffect } from 'react';

import { primaryColor } from '../../utils/data';
import { BButtonGroup, ColorControl } from '../index';
import './Gradient.scss';
import { getRandomColor, randomNumber } from '../../utils/functions';

/**
 * BGradient Component
 *
 * @param {object} props - The props object
 * @param {object} props.value - The value of the gradient
 * @param {function} props.onChange - The function to handle changes in the gradient value
 * @returns {JSX.Element} React component
 */

const Gradient = (props) => {
	const { value = {}, onChange } = props;

	const { type = 'linear', radialType = 'ellipse', colors = [], centerPositions = { x: 0, y: 0 }, angel = 90 } = value;

	const updateColorsProperty = (index, t, val) => {
		const newColors = produce(value.colors, (draft) => {
			draft[index][t] = val;
		});

		onChange({ ...value, colors: newColors });
	};

	const addColor = () => {
		const newColor = [...colors];
		newColor.push({ color: getRandomColor(), position: randomNumber(99) });
		onChange({ ...value, colors: newColor });
	};

	const removeColor = (index) => {
		const newColor = produce(value.colors, (draft) => {
			draft.splice(index, 1);
		});
		onChange({ ...value, colors: newColor });
	};

	useEffect(() => {
		onChange(value);
	}, [value, value]);

	return <>
		<BButtonGroup className='mt10' label='Gradient Type' value={type} onChange={(val) => onChange({ ...value, type: val })} options={[
			{ label: 'Linear', value: 'linear' },
			{ label: 'Radial', value: 'radial' }
		]} />

		{type === 'radial' && <BButtonGroup label='Radial Type' value={radialType} onChange={(val) => onChange({ ...value, radialType: val })} options={[
			{ label: 'Ellipse', value: 'ellipse' },
			{ label: 'Circle', value: 'circle' }
		]} />}

		{colors?.map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
			<ColorControl value={c.color} onChange={(val) => updateColorsProperty(i, 'color', val)} tooltip='Color' />

			<div className='advExtraMargin' style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
				<Tooltip delay={300} text='Position' placement='top'>
					<NumberControl value={c.position} onChange={(val) => updateColorsProperty(i, 'position', val)} min={0} max={100} />
				</Tooltip>

				{colors.length > 1 && <Dashicon style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeColor(i)} icon='trash' />}
			</div>
		</div>)}

		<div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0', }}>
			<Button text='Add Color' variant='tertiary' style={{ color: '#fff', background: primaryColor }} icon='plus' iconPosition='right' onClick={addColor} />
		</div>

		{type === 'radial' ?
			<>
				<RangeControl
					label='Center X Position'
					value={centerPositions?.x}
					onChange={(val) => onChange({ ...value, centerPositions: { ...centerPositions, x: val } })}
					min={0}
					max={100}
				/>

				<RangeControl
					label='Center Y Position'
					value={centerPositions?.y}
					onChange={(val) => onChange({ ...value, centerPositions: { ...centerPositions, y: val } })}
					min={0}
					max={100}
				/>
			</> :
			<RangeControl label='Angle' value={angel} onChange={(val) => onChange({ ...value, angel: val })} min={0} max={360} />}
	</>
};
export default Gradient;