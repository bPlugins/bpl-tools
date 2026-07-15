/**
	* SolidBackground Component
	*
	* @props className (optional): '' (String)
	* @props label (optional): 'Color' (String)
	* @props value (required): The color/background value (String|Object)
	* @props onChange (optional): (Function)
	* @props gradients (optional): Array of gradients (Array)
	*/

import { useState } from 'react';
import { withSelect } from '@wordpress/data';
import { Button, Dropdown, GradientPicker } from '@wordpress/components';

import Label from '../Label/Label';
import BButtonGroup from '../BButtonGroup/BButtonGroup';
import { ColorControl } from '../ColorControl/ColorControl';
import './style.css';
import { gradient } from '../../utils/data';

const SolidBackground = (props) => {
	const { label = 'Color', value, onChange = () => { }, className = '', gradients } = props;
	const [tab, setTab] = useState('solid');
	const id = Math.floor(Math.random() * 9999999);

	return <div className={className}>
		<style>
			{`#customColorControlPanel-${id}-dualColor{
				${value ? `background: ${value};` : `
					background-image: linear-gradient( 45deg, #d5d8dc 25%, transparent 0, transparent 75%, #d5d8dc 0, #d5d8dc ), linear-gradient( 45deg, #d5d8dc 25%, transparent 0, transparent 75%, #d5d8dc 0, #d5d8dc );
					background-size: 16px 16px;
					background-position: 0 0, calc(16px / 2) calc(16px / 2);
				`}
			}`}
		</style>
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
			<Label className=''>
				{label}
			</Label>

			<Dropdown
				className='my-container-class-name'
				contentClassName='my-popover-content-classname'
				renderToggle={({ isOpen, onToggle, onClose }) => <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
					<div id={`customColorControlPanel-${id}-dualColor`} style={{ height: '25px', width: '25px', borderRadius: '50%', border: '1px solid #ccc', }}>
					</div>
					<Button onClick={onToggle} aria-expanded={isOpen} icon='edit' />
				</div>}

				renderContent={({ isOpen, onToggle, onClose }) => (
					<div className='panel-custom-color-control-container'>
						<BButtonGroup label='Type:' options={[{ label: 'Solid', value: 'solid' }, { label: 'Gradient', value: 'gradient' }]} value={tab} onChange={(val) => setTab(val)} />

						{tab === 'solid' && <div style={{ marginTop: '20px' }}>
							<ColorControl
								value={value}
								label='Color :'
								onChange={(value) => onChange(value)}
							/>
						</div>}

						{tab === 'gradient' && <div style={{ marginTop: '10px' }}>
							<GradientPicker
								value={value || gradient}
								onChange={(value) => onChange(value)}
								gradients={gradients}
							/>
						</div>}

						<div onClick={onClose}></div>
					</div>
				)}
			/>
		</div>
	</div>
}
export default withSelect((select) => {
	const { gradients } = select('core/block-editor').getSettings();

	return {
		gradients: gradients.length > 12 ? gradients.slice(0, 12) : gradients
	};
})(SolidBackground);