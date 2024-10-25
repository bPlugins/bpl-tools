/**
 * @props className (optional): 'mt20' (String)
 * @props label (optional): 'Select Icon' (String)
 * @props value (required): { class, fontSize, color } (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { class, fontSize, color } (Object)
 * @props isSize (optional): true (Boolean)
 * @props isColor (optional): true (Boolean)
 */

import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelRow, RangeControl, Tooltip, __experimentalGradientPicker, GradientPicker } from '@wordpress/components';
const Gradient = GradientPicker || __experimentalGradientPicker;

import './IconControl.scss';
import { BtnGroup, ColorControl, Label } from '../index';
import { gradients, bgTypes } from '../../utils/options';
import icons from './icons';

const generateName = cl => cl?.slice(cl?.indexOf(' fa-') + 4);
const generateTitle = cl => generateName(cl)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const IconControl = props => {
	const { className = '', label = __('Select Icon:'), value = {}, onChange, defaults = {}, isSize = true, isColor = true } = props;

	const defaultVal = { class: '', fontSize: 16, colorType: 'solid', color: 'inherit', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }

	const getDefault = property => defaults[property] || defaultVal[property];

	const getValue = property => value[property] || getDefault(property);
	const setValue = (property, val) => onChange({ ...value, [property]: val });

	// Font family searching
	const [query, setQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const searchIcons = icons.filter(icon => generateTitle(icon).toLowerCase().includes(query.toLowerCase()));

	return <>
		<PanelRow className={`bPlIconTitle ${className}`}>
			<Label className='mt0 mb0'>{label}</Label>

			<Tooltip text={generateTitle(value.class)} placement='top' position='top'>
				<i className={value.class} />
			</Tooltip>
		</PanelRow>

		<div className='bPlIconSelect'>
			<input type='search' value={query} onClick={() => setIsSearching(!isSearching)} placeholder={generateTitle(getValue('class')) || 'Search & Select Icon'} onChange={e => setQuery(e.target.value)} />

			<span className={`dashicon dashicons dashicons-${isSearching ? 'arrow-up' : 'arrow-down'}`} onClick={() => setIsSearching(!isSearching)}></span>

			{isSearching && <div className='bPlIconLists'>
				{searchIcons?.map(icon => <Tooltip key={icon} text={generateTitle(icon)} placement='top' position='top'>
					<i onClick={() => {
						onChange({ ...value, class: icon });
						setQuery('');
						setIsSearching(false);
					}} className={icon} />
				</Tooltip>)}
			</div>}
		</div>

		{isSize && <>
			<Label>{__('Icon Size:')}</Label>
			<RangeControl value={getValue('fontSize')} onChange={val => setValue('fontSize', val)} min={0} max={400} step={1} allowReset={true} resetFallbackValue={getDefault('fontSize')} initialPosition={getDefault('fontSize')} />
		</>}

		{isColor && <>
			<PanelRow className='mt20'>
				<Label className=''>{__('Color Type:')}</Label>
				<BtnGroup value={getValue('colorType')} onChange={val => setValue('colorType', val)} options={bgTypes} size='small' />
			</PanelRow>

			{'gradient' === getValue('colorType') ? <Gradient value={getValue('gradient')} onChange={val => setValue('gradient', val)} gradients={gradients} /> : <ColorControl label={__('Icon Color:')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />}
		</>}
	</>
};
export default IconControl;