import { useEffect, useState } from 'react';
import { Button, Dashicon, __experimentalNumberControl as NumberControl, RangeControl, Tooltip } from '@wordpress/components';
import { produce } from 'immer';

import './Gradient.scss';
import { BButtonGroup, ColorControl } from '../index';

/**
 * BGradient Component
 *
 * @param {object} props - The props object
 * @param {object} props.value - The value of the gradient
 * @param {function} props.onChange - The function to handle changes in the gradient value
 * @returns {JSX.Element} React component
 */

const Gradient = (props) => {
	const { value, onChange } = props;
	const [advGradient, setAdvGradient] = useState(
		value || {
			type: 'linear',
			radialType: 'ellipse',
			colors: [
				{ color: '', position: 0 },
				{ color: '', position: 0 },
			],
			centerPositions: { x: 0, y: 0 },
			angel: 90,
		}
	);
	const { type, radialType, colors, centerPositions, angel } = advGradient;

	const updateColorsProperty = (index, t, val) => {
		const newColors = produce(advGradient.colors, (draft) => {
			draft[index][t] = val;
		});
		setAdvGradient({ ...advGradient, colors: newColors });
		onChange({ ...advGradient, colors: newColors });
	};

	const addColor = () => {
		const newColor = produce(advGradient.colors, (draft) => {
			draft.push({ color: '#f00', position: 0 });
		});
		setAdvGradient({ ...advGradient, colors: newColor });
		onChange({ ...advGradient, colors: newColor });
	};

	const removeColor = (index) => {
		const newColor = produce(advGradient.colors, (draft) => {
			draft.splice(index, 1);
		});
		setAdvGradient({ ...advGradient, colors: newColor });
		onChange({ ...advGradient, colors: newColor });
	};

	useEffect(() => {
		onChange(advGradient);
	}, [advGradient, value]);

	return <>
		<BButtonGroup label='Gradient Type' value={type} onChange={(val) => setAdvGradient({ ...advGradient, type: val })} options={[
			{ label: 'Linear', value: 'linear' },
			{ label: 'Radial', value: 'radial' }
		]} />

		{type === 'radial' && <BButtonGroup label='Radial Type' value={radialType} onChange={(val) => setAdvGradient({ ...advGradient, radialType: val })} options={[
			{ label: 'Ellipse', value: 'ellipse' },
			{ label: 'Circle', value: 'circle' }
		]} />}

		{colors?.map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
			<ColorControl value={c.color} onChange={(val) => updateColorsProperty(i, 'color', val)} tooltip='Color' />

			<div className='advExtraMargin' style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
				<Tooltip delay={300} text='Position' placement='top'>
					<NumberControl value={c.position} onChange={(val) => updateColorsProperty(i, 'position', val)} min={0} max={100} />
				</Tooltip>

				{colors.length > 2 && <Dashicon style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeColor(i)} icon='trash' />}
			</div>
		</div>)}

		<div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0', }}>
			<Button text='Add Color' variant='tertiary' style={{ background: '#4527a4', color: '#fff' }} icon='plus' iconPosition='right' onClick={addColor} />
		</div>

		{type === 'radial' ?
			<>
				<RangeControl
					label='Center X Position'
					value={centerPositions?.x}
					onChange={(val) => setAdvGradient({ ...advGradient, centerPositions: { ...centerPositions, x: val } })}
					min={0}
					max={100}
				/>

				<RangeControl
					label='Center Y Position'
					value={centerPositions?.y}
					onChange={(val) => setAdvGradient({ ...advGradient, centerPositions: { ...centerPositions, y: val } })}
					min={0}
					max={100}
				/>
			</> :
			<RangeControl label='Angle' value={angel} onChange={(val) => setAdvGradient({ ...advGradient, angel: val })} min={0} max={360} />}
	</>
};
export default Gradient;