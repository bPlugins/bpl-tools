import { withSelect } from '@wordpress/data';
import { PanelBody, TabPanel } from '@wordpress/components';

import { AdvBackground, OverlayControl } from '../Components';
import { updateData } from '../utils/functions';

const Background = ({ background, onChange, enabled, isVideo }) => {
	const tabs = enabled?.filter(e => 'overlay' !== e)?.map(e => ({ title: e, name: e }));

	const isEnabled = (which) => enabled.includes(which);

	return <PanelBody className='bPlPanelBody' title='Background' initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={tabs}>{tab => <>
			{'normal' === tab.name && <>
				<AdvBackground name={'Background'} value={background?.[tab.name]} onChange={(val) => onChange(updateData(background, val, tab.name))} isVideo={isVideo} />

				{isEnabled('overlay') && <OverlayControl value={background?.overlay} onChange={(val) => onChange(updateData(background, val, 'overlay'))} />}
			</>}

			{'hover' === tab.name && <>
				<AdvBackground name={'Hover Background'} value={background?.[tab.name]} onChange={(val) => onChange(updateData(background, val, tab.name))} isVideo={false} isHover={true} />

				{isEnabled('overlay') && <OverlayControl value={background?.hoverOverlay} onChange={(val) => onChange(updateData(background, val, 'hoverOverlay'))} />}
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
})(Background);