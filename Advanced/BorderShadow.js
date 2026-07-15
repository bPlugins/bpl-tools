/**
	* BorderShadow Component
	*
	* @props borderShadow (required): border, radius and shadow settings keyed by tab name (Object)
	* @props onChange (required): handler called with updated borderShadow data (Function)
	* @props enabled (required): list of enabled tabs/features e.g. normal, hover, border, shadow (Array)
	*/

import { __ } from '@wordpress/i18n';
import { PanelBody, TabPanel, PanelRow, RangeControl, __experimentalBorderBoxControl as BorderBoxControl } from '@wordpress/components';

import Label from '../Components/Label/Label';
import ShadowControl from '../Components/ShadowControl/ShadowControl';
import BoxControl from '../Components/BoxControl/BoxControl';
import { updateData } from '../utils/functions';

const BorderShadow = ({ borderShadow, onChange, enabled }) => {
	const tabs = enabled?.filter(e => !['border', 'shadow'].includes(e))?.map(e => ({ title: e, name: e }));

	const isEnabled = (which) => enabled.includes(which);

	return <PanelBody className='bPlPanelBody' title='Border & Shadow' initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={tabs}>{tab => <>
			{'normal' === tab.name && <>
				{isEnabled('border') && <>
					<BorderBoxControl label={__('Borders')} value={borderShadow?.[tab.name]?.border} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'border'))} />

					<PanelRow className='mt20 mb5'>
						<Label className=''>{__('Border Radius')}</Label>
					</PanelRow>
					<BoxControl values={borderShadow?.[tab.name]?.radius} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'radius'))} />
				</>}

				{isEnabled('shadow') && <ShadowControl label={__('Shadow')} value={borderShadow?.[tab.name]?.shadow} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'shadow'))} />}
			</>}

			{'hover' === tab.name && <>
				<RangeControl className='mt10 mb10' label='Hover Transition' value={borderShadow?.transition || 0.4} onChange={val => onChange(updateData(borderShadow, val, 'transition'))} min={0} max={10} step={0.05} />

				{isEnabled('border') && <>
					<BorderBoxControl className='mt20' label={__('Borders')} value={borderShadow?.[tab.name]?.border} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'border'))} />

					<PanelRow className='mt20 mb5'>
						<Label className=''>{__('Border Radius')}</Label>
					</PanelRow>
					<BoxControl values={borderShadow?.[tab.name]?.radius} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'radius'))} />
				</>}

				{isEnabled('shadow') && <ShadowControl label={__('Shadow')} value={borderShadow?.[tab.name]?.shadow} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'shadow'))} />}
			</>}
		</>}
		</TabPanel>
	</PanelBody>
}
export default BorderShadow;