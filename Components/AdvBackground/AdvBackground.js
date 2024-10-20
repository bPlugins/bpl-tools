import { useEffect, useState } from 'react';
import { withSelect } from '@wordpress/data';
import { TabPanel, PanelRow, __experimentalInputControl as InputControl, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label } from '../Label/Label';
import { SolidBackground } from '../SolidBackground/SolidBackground';
import { MediaArea } from '../MediaControl/MediaControl';
import { Device } from '../Device/Device';
import { Gradient } from '../Gradient/Gradient';
import { advGradientOptions, bgTabs, imgAttachmentOptions, imgPositionOptions, imgRepeatOptions, imgSizeOptions, unitOptions, } from './utils/options';

const defImgProp = {
	position: 'center-center',
	xPosition: 0,
	yPosition: 0,
	attachment: '',
	repeat: 'no-repeat',
	size: '',
	customSize: '0px',
}

export const AdvBackground = ({ name = 'Background', value, onChange, isVideo = false, isHover = false, device }) => {
	const [bgValue, setBgValue] = useState(value || {
		type: 'color',
		color: '#0000',
		gradient: advGradientOptions,
		img: {
			url: '',
			desktop: defImgProp,
			tablet: defImgProp,
			mobile: defImgProp,
		},
		video: { url: '', loop: false }
	});

	const { type, color, gradient, img = {}, video = {} } = value || bgValue || {};
	const { position = 'center center', xPosition, yPosition, attachment, repeat = 'no-repeat', size = 'cover', customSize, } = img?.[device] || {};

	useEffect(() => onChange(bgValue), [bgValue]);

	return <>
		<Label className='mt10 mb10'>{name} Type</Label>
		<TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={isVideo ? bgTabs : bgTabs.filter(t => t.name !== 'video')} initialTabName={type} onSelect={tab => onChange({ ...value, type: tab })}>{tab => <>
			{'color' === tab.name && <SolidBackground className='mt20' label={`${name} Color`} value={color} onChange={(val) => onChange({ ...value, color: val })} />}

			{'gradient' === tab.name && <Gradient value={gradient} onChange={(val) => onChange({ ...value, gradient: val })} />}

			{'image' === tab.name && <>
				<Label className='mt10 mb10'>{name} Image</Label>

				<MediaArea label='Upload Image' value={value?.img} onChange={(val) => onChange({ ...value, img: { ...img, url: val.url } })} width='100%' height='100%' />

				{img?.url && <>
					<PanelRow className='mt20'>
						<Label className=''>Position</Label>
						<Device />
					</PanelRow>
					<SelectControl
						value={position}
						options={imgPositionOptions}
						onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], position: val } } })}
					/>

					{position === 'custom' && <>
						<PanelRow className='mt15'>
							<Label className=''>X Position</Label>
							<Device />
						</PanelRow>
						<UnitControl
							units={unitOptions}
							value={xPosition}
							min={-2000}
							max={2000}
							onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], xPosition: val } } })}
						/>

						<PanelRow className='mt15'>
							<Label className=''>Y Position</Label>
							<Device />
						</PanelRow>
						<UnitControl
							units={unitOptions}
							value={yPosition}
							min={-2000}
							max={2000}
							onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], yPosition: val } } })}
						/>
					</>}

					<PanelRow className='mt20'>
						<Label className=''>Attachment</Label>
						<Device />
					</PanelRow>
					<SelectControl
						value={attachment}
						options={imgAttachmentOptions}
						onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], attachment: val } } })}
					/>

					<PanelRow className='mt20'>
						<Label className=''>Repeat</Label>
						<Device />
					</PanelRow>
					<SelectControl
						value={repeat}
						options={imgRepeatOptions}
						onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], repeat: val } } })}
					/>

					<PanelRow className='mt20'>
						<Label className=''>Size</Label>
						<Device />
					</PanelRow>
					<SelectControl
						value={size}
						options={imgSizeOptions}
						onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], size: val } } })}
					/>

					{size === 'custom' && <>
						<PanelRow className='mt15'>
							<Label className=''>Width</Label>
							<Device />
						</PanelRow>
						<UnitControl
							units={unitOptions}
							value={customSize}
							min={-2000}
							max={2000}
							onChange={val => onChange({ ...value, img: { ...img, [device]: { ...img[device], customSize: val } } })}
						/>
					</>}
				</>}
			</>}


			{'video' === tab.name && <>
				<Label className='mt10 mb10'>{name} Video</Label>

				<MediaArea loop={video?.loop} types={['video/mp4', 'video/3gpp', 'video/x-ms-wmv']} isVideo={true} value={video} onChange={(val) => onChange({ ...value, video: { ...video, url: val.url } })} label='Upload Video' />

				<InputControl style={{ marginTop: '10px' }} label='Inline Upload' labelPosition='top' type='text' value={video?.url} onChange={val => onChange({ ...value, video: { ...video, url: val } })} placeholder='Insert your video link..' />

				{video?.url && <ToggleControl className='mt10' label='Loop' checked={video?.loop} value={video?.loop} onChange={val => onChange({ ...value, video: { ...video, loop: val } })} />}
			</>}
		</>}
		</TabPanel>
	</>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(AdvBackground);