import { withSelect } from '@wordpress/data';
import { PanelBody, TabPanel, RangeControl } from '@wordpress/components';

import { AdvBackground, OverlayControl } from '../Components';
import { updateData } from '../utils/functions';

const Background = ({ background, onChange, enabled, isPremium }) => {
	const tabs = enabled?.filter(e => 'overlay' !== e)?.map(e => ({ title: e, name: e }));

	const isEnabled = (which) => enabled.includes(which);

	return <PanelBody className='bPlPanelBody' title='Background' initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={tabs}>{tab => <>
			{'normal' === tab.name && <>
				<AdvBackground name={'Background'} value={background?.[tab.name]} onChange={(val) => onChange(updateData(background, val, tab.name))} isVideo={isPremium} />

				{isEnabled('overlay') && <OverlayControl value={background?.overlay} onChange={(val) => onChange(updateData(background, val, 'overlay'))} />}
			</>}

			{'hover' === tab.name && <>
				<RangeControl className='mt10 mb10' label='Hover Transition' value={background?.transition || 0.4} onChange={val => onChange(updateData(background, val, 'transition'))} min={0} max={10} step={0.05} />

				<AdvBackground name={'Hover Background'} value={background?.[tab.name]} onChange={(val) => onChange(updateData(background, val, tab.name))} isVideo={false} isHover={true} />

				{isEnabled('overlay') && <OverlayControl value={background?.hoverOverlay} onChange={(val) => onChange(updateData(background, val, 'hoverOverlay'))} />}
			</>}
		</>}
		</TabPanel>
	</PanelBody>
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Background);