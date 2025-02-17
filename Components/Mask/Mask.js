import { PanelBody, PanelRow, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import Label from '../Label/Label';
import { MediaArea } from '../MediaControl/MediaControl';
import { positionOptions, repeatOptions, shapeOptions, sizeOptions } from './utils/options';

const Mask = ({ mask, onChange }) => {
	const { isMask = false, shape = {}, size = {}, position = {}, repeat = 'no-repeat' } = mask || {}

	return <PanelBody className='bPlPanelBody' title='Mask' initialOpen={false}>
		<ToggleControl className='mb10' label='Mask' checked={isMask} value={isMask} onChange={val => onChange({ ...mask, isMask: val })} />

		{isMask && <>
			<PanelRow>
				<Label className=''>Shape</Label>
				<SelectControl options={shapeOptions} value={shape.type} onChange={val => onChange({ ...mask, shape: { ...mask.shape, type: val } })} />
			</PanelRow>

			{shape.type === 'custom' && <MediaArea className='mt10' types={['image/svg+xml']} value={{ url: shape.url }} onChange={val => onChange({ ...mask, shape: { ...mask.shape, url: val.url } })} />}

			<PanelRow className='mt10'>
				<Label className=''>Size</Label>
				<SelectControl options={sizeOptions} value={size.type} onChange={val => onChange({ ...mask, size: { ...mask.size, type: val } })} />
			</PanelRow>

			{size.type === 'custom' && <UnitControl label='Size' labelPosition='edge' min={0} max={1000} value={size.scale} onChange={val => onChange({ ...mask, size: { ...mask.size, scale: val } })} />}

			<PanelRow>
				<Label className=''>Position</Label>
				<SelectControl options={positionOptions} value={position.type} onChange={val => onChange({ ...mask, position: { ...mask.position, type: val } })} />
			</PanelRow>

			{position.type === 'custom' && <>
				<UnitControl className='mt10' label='Position X' labelPosition='edge' min={-1000} max={1000} value={position.x} onChange={val => onChange({ ...mask, position: { ...mask.position, x: val } })} />

				<UnitControl className='mt10' label='Position Y' labelPosition='edge' min={-1000} max={1000} value={position.y} onChange={val => onChange({ ...mask, position: { ...mask.position, y: val } })} />
			</>}

			{size.type !== 'cover' && <PanelRow>
				<Label className=''>Repeat</Label>

				<SelectControl options={repeatOptions} value={repeat} onChange={val => onChange({ ...mask, repeat: val })} />
			</PanelRow>}
		</>}
	</PanelBody>
}
export default Mask;