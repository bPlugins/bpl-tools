import { PanelBody, RangeControl, TabPanel } from '@wordpress/components';

import AdvTransform from '../Components/AdvTransform/AdvTransform';
import { normalHoverTabs } from '../utils/options';
import { sizeAndMarginProps } from '../utils/defaultProps';

const Transform = ({ transform = {}, onChange = () => { }, device }) => {
	const { normal, hover, transition } = transform || {}
	return <PanelBody className='bPlPanelBody' title='Transform' initialOpen={false}>
		<TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={normalHoverTabs}>
			{tab => <>
				{tab.name === 'normal' && <AdvTransform value={normal} device={device} onChange={value => onChange({ ...transform, normal: value })} />}

				{tab.name === 'hover' && <>
					<AdvTransform value={hover} device={device} onChange={value => onChange({ ...transform, hover: value })} />

					<RangeControl className='bPlPanelBody' label='Transition Duration (ms)' value={transition} max={10000} onChange={(val) => onChange({ ...transform, transition: val })} {...sizeAndMarginProps} />
				</>
				}
			</>}
		</TabPanel>
	</PanelBody>
}
export default Transform;