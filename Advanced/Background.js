import { withSelect } from '@wordpress/data';
import { PanelBody, TabPanel, RangeControl } from '@wordpress/components';

import { AdvBackground } from '../Components';
import { updateData } from '../utils/functions';

const Background = ({ background, onChange, enabled, isVideo, device }) => {
	const tabs = enabled?.map(e => ({ title: e, name: e }));

	const isEnabled = (which) => enabled.includes(which);

	return <PanelBody className='bPlPanelBody' title='Background'>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={tabs}>{tab => <>
			{'normal' === tab.name && <AdvBackground name={'Background'} value={background?.[tab.name]} onChange={(val) => onChange(updateData(background, val, tab.name))} isVideo={isVideo} device={device} />}

			{'hover' === tab.name && <>
				<RangeControl className='mt10 mb5' label={`Hover Transition`} value={background?.transition} onChange={(val) => onChange(updateData(background, val, 'transition'))} min={0} max={5} step={0.05} />

				<AdvBackground name={'Hover Background'} value={background?.[tab.name]} onChange={(val) => onChange(updateData(background, val, tab.name))} device={device} isVideo={false} />
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