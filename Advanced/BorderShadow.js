import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { PanelBody, TabPanel, PanelRow, __experimentalBorderBoxControl as BorderBoxControl } from '@wordpress/components';

import { Label, ShadowControl, BoxControl } from '../Components';
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
				{isEnabled('border') && <>
					<BorderBoxControl label={__('Borders')} value={borderShadow?.[tab.name]?.border} onChange={val => onChange(updateData(borderShadow, val, tab.name, 'border'))} />

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
export default withSelect((select) => {
	const { __experimentalGetPreviewDeviceType } = select('core/edit-post');

	return {
		device: __experimentalGetPreviewDeviceType()?.toLowerCase()
	}
})(BorderShadow);