/**
 * @props className (optional): 'mt20' (String)
 * @props label: 'Color' (String)
 * @props value: value of color (String)
 * @props defaultColor: default color for reset color
 * @props onChange: (Function)
 * @props disableAlpha: Disable alpha of color (Boolean)
 * @return color (String)
 */

import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { Dropdown, ColorPicker, Button, PanelRow } from '@wordpress/components';

import './ColorControl.scss';
import { Label } from '../index';

const ThemeColors = withSelect((select) => {
	return {
		themeColors: select('core/block-editor').getSettings().colors
	}
})(({ isOpen, onClose, onChange, themeColors }) => {
	return themeColors.length ? <div className='bPlThemeColors'>
		{themeColors.map(({ color }) => <div key={color} className='bPlColorButtonContainer'>
			<button
				className='bPlColorButton'
				aria-expanded={isOpen}
				style={{ backgroundColor: color || 'transparent' }}
				onClick={() => {
					onChange(color);
					onClose;
				}}
			/>
		</div>)}
	</div> : null;
});

export const ColorControl = props => {
	const { className = '', label = __('Color:'), value, onChange, defaultColor, disableAlpha = false } = props;

	return <PanelRow className={className}>
		<Label className=''>{label}</Label>

		<Dropdown className='bPlDropdownContainer bPlColor' contentClassName='bPlDropdownPopover bPlColorPopover' popoverProps={{ placement: 'top-end' }}
			renderToggle={({ isOpen, onToggle }) => {
				return <>
					<div className='bPlColorButtonContainer'>
						<button className='bPlColorButton' onClick={onToggle} aria-expanded={isOpen} style={{ backgroundColor: value || 'transparent' }} />
					</div>

					{defaultColor && defaultColor != value && <Button className='bPlResetVal' icon='image-rotate' label={__('Reset')} onClick={() => onChange(defaultColor)} />}
				</>;
			}}

			renderContent={({ isOpen, onClose }) => <>
				<ColorPicker color={value || ''} disableAlpha={disableAlpha} onChangeComplete={(c) => onChange(`rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`)} />

				<ThemeColors {...{ isOpen, onClose, onChange }} />
			</>}
		/>
	</PanelRow>
};


export const HexColorControl = props => {
	const { className = '', label = __('Color:'), value, onChange, defaultColor, disableAlpha } = props;

	return <PanelRow className={className}>
		<Label className=''>{label}</Label>

		<Dropdown className='bPlDropdownContainer bPlColor' contentClassName='bPlDropdownPopover bPlColorPopover' popoverProps={{ placement: 'top-end' }}
			renderToggle={({ isOpen, onToggle }) => <>
				<div className='bPlColorButtonContainer'>
					<button className='bPlColorButton' onClick={onToggle} aria-expanded={isOpen} style={{ backgroundColor: value || 'transparent' }} />
				</div>

				{defaultColor && defaultColor != value && <Button className='bPlResetVal' icon='image-rotate' label={__('Reset')} onClick={() => onChange(defaultColor)} />}
			</>}

			renderContent={({ isOpen, onClose }) => <>
				<ColorPicker className='bPlColorControl' color={value || ''} onChangeComplete={c => {
					const alphaToHex = disableAlpha ? '' : ('0' + Math.round(c.rgb.a * 255).toString(16)).slice(-2);
					onChange(c.hex + alphaToHex)
				}} disableAlpha={disableAlpha} />

				<ThemeColors {...{ isOpen, onClose, onChange }} />
			</>}
		/>
	</PanelRow>
};