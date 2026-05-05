import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { Flex, PanelBody, PanelRow, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, Device, Label } from '../index'
import { updateData } from '../../utils/functions';

const Dimension = ({ dimension, onChange, title = __('Dimension'), enabled, device }) => {
	const { padding = {}, margin = {}, width = {}, height = {} } = dimension || {};

	const isEnabled = (which) => enabled.includes(which);
	// const isAlignShow = enabled.includes('width') || enabled.includes('minWidth') || enabled.includes('maxWidth');

	return <PanelBody className='bPlPanelBody' title={title}>
		{isEnabled('width') && <Flex className='mb5' gap='20px'>
			<Flex className='flex1' gap='2px'> <Label className=''>Width</Label> <Device /> </Flex>
			<UnitControl className='flex1' label="" labelPosition='edge' value={width?.width?.[device]} onChange={val => onChange(updateData(dimension, val, 'width', 'width', device))} __next40pxDefaultSize />
		</Flex>}

		{isEnabled('minWidth') && <Flex className='mb5' gap='20px'>
			<Flex className='flex1'> <Label className=''>Min Width</Label> <Device style={{ marginLeft: "auto" }} /> </Flex>
			<UnitControl className='flex1' label="" labelPosition='edge' value={width?.min?.[device]} onChange={val => onChange(updateData(dimension, val, 'width', 'min', device))} __next40pxDefaultSize />
		</Flex>}

		{isEnabled('maxWidth') && <Flex className='mb15' gap='20px'>
			<Flex className='flex1'> <Label className=''>Max Width</Label> <Device /> </Flex>
			<UnitControl className='flex1' label="" labelPosition='edge' value={width?.max?.[device]} onChange={val => onChange(updateData(dimension, val, 'width', 'max', device))} __next40pxDefaultSize />
		</Flex>}

		{isEnabled('height') && <Flex className='mb5' gap='20px'>
			<Flex className='flex1'> <Label className=''>Height</Label> <Device /> </Flex>
			<UnitControl className='flex1' label="" labelPosition='edge' value={height?.height?.[device]} onChange={val => onChange(updateData(dimension, val, 'height', 'height', device))} __next40pxDefaultSize />
		</Flex>}

		{isEnabled('minHeight') && <Flex className='mb5' gap='20px'>
			<Flex className='flex1'> <Label className=''>Min Height</Label> <Device /> </Flex>
			<UnitControl className='flex1' label="" labelPosition='edge' value={height?.min?.[device]} onChange={val => onChange(updateData(dimension, val, 'height', 'min', device))} __next40pxDefaultSize />
		</Flex>}

		{isEnabled('maxHeight') && <Flex gap='20px'>
			<Flex className='flex1'> <Label className=''>Max Height</Label> <Device /> </Flex>
			<UnitControl className='flex1' label="" labelPosition='edge' value={height?.max?.[device]} onChange={val => onChange(updateData(dimension, val, 'height', 'max', device))} __next40pxDefaultSize />
		</Flex>}

		{isEnabled('padding') && <>
			<PanelRow className='mb5'> <Label className=''>Padding</Label> <Device /> </PanelRow>
			<BoxControl values={padding[device]} onChange={val => onChange(updateData(dimension, val, 'padding', device))} />
		</>}

		{isEnabled('margin') && <>
			<PanelRow className='mt20 mb5'> <Label className=''>Margin</Label> <Device /> </PanelRow>
			<BoxControl values={margin[device]} onChange={val => onChange(updateData(dimension, val, 'margin', device))} />
		</>}
	</PanelBody>
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Dimension);