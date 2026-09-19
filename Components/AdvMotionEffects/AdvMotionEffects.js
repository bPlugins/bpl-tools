import { Flex, PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components'
import { withSelect } from '@wordpress/data';
import CustomPopover from '../CustomPopover/CustomPopover';
import { meMouseTrack, meVerticalRsVal } from './utils/options';
import Label from '../Label/Label';
import SelectTokenField from '../SelectTokenField/SelectTokenField';
import Device from '../Device/Device';

const AdvMotionEffects = ({ motion, onChange = () => { }, device }) => {
    // Nothing passes `device` in -- Advanced/index.js renders this with only motion and
    // onChange -- so the Sticky control was writing its value under the literal key
    // "undefined" and generateCSS never found a desktop/tablet/mobile entry. The editor's

    const { isEnable = false, vertical = {}, horizontal = {}, transparency = {}, blur = {}, rotate = {}, scale = {}, effectsRelativeTo = 'viewport', effectOn = ['desktop', 'tablet-portrait', 'mobile-portrait'], isMouseEffect = false, mouseTrack = {}, tilt = {}, sticky = {} } = motion;

    return <PanelBody className='bPlPanelBody' title='Motion Effects' initialOpen={false}>

        <ToggleControl label='Scrolling Effects' checked={isEnable} value={isEnable} onChange={val => onChange({ ...motion, isEnable: val })} />
        {isEnable && <>

            <CustomPopover value={vertical || {}} resetValues={meVerticalRsVal} onClick={(val) => onChange({ ...motion, vertical: val })} icon='edit' label='Vertical Scroll'>

                <SelectControl value={vertical?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'Up', value: 'up' }, { label: 'Down', value: 'down' }]} onChange={val => onChange({ ...motion, vertical: { ...motion?.vertical, direction: val } })} />

                <RangeControl label='Speed' step={0.1} min={0} max={10} value={vertical?.speed} onChange={val => onChange({ ...motion, vertical: { ...motion?.vertical, speed: val } })} />

                <Label className='mt10 mb10'>ViewPort</Label>

                <RangeControl label='Bottom (%)' value={vertical?.bottom} onChange={val => onChange({ ...motion, vertical: { ...motion?.vertical, bottom: val } })} />

                <RangeControl label='Top (%)' value={vertical?.top} onChange={val => onChange({ ...motion, vertical: { ...vertical, top: val } })} />

            </CustomPopover>

            <CustomPopover value={horizontal || {}} resetValues={meVerticalRsVal} onClick={(val) => onChange({ ...motion, horizontal: val })} icon='edit' label='Horizontal Scroll'>

                <SelectControl value={horizontal?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'To Left', value: 'to-left' }, { label: 'To Right', value: 'to-right' }]} onChange={val => onChange({ ...motion, horizontal: { ...motion?.horizontal, direction: val } })} />

                <RangeControl label='Speed' step={0.1} min={0} max={10} value={horizontal?.speed} onChange={val => onChange({ ...motion, horizontal: { ...motion?.horizontal, speed: val } })} />

                <Label className='mt10 mb10'>ViewPort</Label>
                <RangeControl label='Bottom (%)' value={horizontal?.bottom} onChange={val => onChange({ ...motion, horizontal: { ...motion?.horizontal, bottom: val } })} />
                <RangeControl label='Top (%)' value={horizontal?.top} onChange={val => onChange({ ...motion, horizontal: { ...horizontal, top: val } })} />

            </CustomPopover>

            <CustomPopover value={transparency || {}} resetValues={meVerticalRsVal} onClick={(val) => onChange({ ...motion, transparency: val })} icon='edit' label='Transparency'>

                <SelectControl value={transparency?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'Fade In', value: 'fade-in' }, { label: 'Fade Out', value: 'fade-out' }, { label: 'Fade Out In', value: 'fade-out-in' }, { label: 'Fade In Out', value: 'fade-in-out' }]} onChange={val => onChange({ ...motion, transparency: { ...transparency, direction: val } })} />

                <RangeControl label='Level' step={0.1} min={0} max={10} value={transparency?.level} onChange={val => onChange({ ...motion, transparency: { ...transparency, level: val } })} />

                <Label className='mt10 mb10'>ViewPort</Label>
                <RangeControl label='Bottom (%)' value={transparency?.bottom} onChange={val => onChange({ ...motion, transparency: { ...transparency, bottom: val } })} />
                <RangeControl label='Top (%)' value={transparency?.top} onChange={val => onChange({ ...motion, transparency: { ...transparency, top: val } })} />

            </CustomPopover>

            <CustomPopover value={blur || {}} resetValues={meVerticalRsVal} onClick={(val) => onChange({ ...motion, blur: val })} icon='edit' label='Blur'>

                <SelectControl value={blur?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'Fade In', value: 'fade-in' }, { label: 'Fade Out', value: 'fade-out' }, { label: 'Fade Out In', value: 'fade-out-in' }, { label: 'Fade In Out', value: 'fade-in-out' }]} onChange={val => onChange({ ...motion, blur: { ...blur, direction: val } })} />

                <RangeControl label='Level' step={0.1} min={0} max={10} value={blur?.level} onChange={val => onChange({ ...motion, blur: { ...blur, level: val } })} />

                <Label className='mb10 mt10'>ViewPort</Label>
                <RangeControl label='Bottom (%)' value={blur?.bottom} onChange={val => onChange({ ...motion, blur: { ...blur, bottom: val } })} />
                <RangeControl label='Top (%)' value={blur?.top} onChange={val => onChange({ ...motion, blur: { ...blur, top: val } })} />

            </CustomPopover>

            <CustomPopover value={rotate || {}} resetValues={meVerticalRsVal} onClick={(val) => onChange({ ...motion, rotate: val })} icon='edit' label='Rotate'>

                <SelectControl value={rotate?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'To Left', value: 'to-left' }, { label: 'To Right', value: 'to-right' }]} onChange={val => onChange({ ...motion, rotate: { ...rotate, direction: val } })} />

                <RangeControl label='Level' step={0.1} min={0} max={10} value={rotate?.level} onChange={val => onChange({ ...motion, rotate: { ...rotate, level: val } })} />

                <Label className='mt10 mb10'>ViewPort</Label>
                <RangeControl label='Bottom (%)' value={rotate?.bottom} onChange={val => onChange({ ...motion, rotate: { ...rotate, bottom: val } })} />
                <RangeControl label='Top (%)' value={rotate?.top} onChange={val => onChange({ ...motion, rotate: { ...rotate, top: val } })} />


            </CustomPopover>

            <CustomPopover value={scale || {}} resetValues={meVerticalRsVal} onClick={(val) => onChange({ ...motion, scale: val })} icon='edit' label='Scale'>

                <SelectControl value={scale?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'Scale Up', value: 'scale-up' }, { label: 'Scale Down', value: 'scale-down' }, { label: 'Scale Down Up', value: 'scale-down-up' }, { label: 'Scale Up Down', value: 'scale-up-down' }]} onChange={val => onChange({ ...motion, scale: { ...scale, direction: val } })} />

                <RangeControl label='Speed' step={0.1} min={0} max={10} value={scale?.level} onChange={val => onChange({ ...motion, scale: { ...scale, level: val } })} />

                <Label className='mb10 mt10'>ViewPort</Label>
                <RangeControl label='Bottom (%)' value={scale?.bottom} onChange={val => onChange({ ...motion, scale: { ...scale, bottom: val } })} />
                <RangeControl label='Top (%)' value={scale?.top} onChange={val => onChange({ ...motion, scale: { ...scale, top: val } })} />


            </CustomPopover>

            <SelectControl className='mt10' label='Effects Relative To' labelPosition='edge' value={effectsRelativeTo} options={[{ label: 'Entire Page', value: 'entire-page' }, { label: 'Viewport', value: 'viewport' }]} onChange={val => onChange({ ...motion, effectsRelativeTo: val })} />

            <Label className='mt5'>Apply Effect On</Label>
            <SelectTokenField options={[{ label: 'Desktop', value: 'desktop' }, { label: 'Tablet Portrait', value: 'tablet-portrait' }, { label: 'Mobile Portrait', value: 'mobile-portrait' }]} value={effectOn} defaultValue={['desktop', 'tablet-portrait', 'mobile-portrait']} onChange={val => onChange({ ...motion, effectOn: val })} />

        </>
        }

        <hr className='mt10 mb10' />
        <ToggleControl label='Mouse Effects' value={isMouseEffect} checked={isMouseEffect} onChange={val => onChange({ ...motion, isMouseEffect: val })} />

        {isMouseEffect && <>

            <CustomPopover label='Mouse Track' resetValues={meMouseTrack} icon='edit' value={mouseTrack} onClick={(val) => onChange({ ...motion, mouseTrack: val })} >

                <SelectControl value={mouseTrack?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'Direct', value: 'direct' }, { label: 'Opposite', value: 'opposite' }]} onChange={val => onChange({ ...motion, mouseTrack: { ...mouseTrack, direction: val } })} />

                <RangeControl label='Speed' step={0.1} min={0} max={10} value={mouseTrack?.speed} onChange={val => onChange({ ...motion, mouseTrack: { ...mouseTrack, speed: val } })} />

            </CustomPopover>

            <CustomPopover label='3D Tilt' resetValues={meMouseTrack} value={tilt} icon='edit' onClick={val => onChange({ ...motion, tilt: val })} >

                <SelectControl value={tilt?.direction} label='Direction' labelPosition='edge' options={[{ label: 'None', value: '' }, { label: 'Direct', value: 'direct' }, { label: 'Opposite', value: 'opposite' }]} onChange={val => onChange({ ...motion, tilt: { ...tilt, direction: val } })} />

                <RangeControl label='Speed' step={0.1} min={0} max={10} value={tilt?.speed} onChange={val => onChange({ ...motion, tilt: { ...tilt, speed: val } })} />

            </CustomPopover>

        </>}

        <hr className='mt10 mb10' />
        <Flex>

            <Label className='mb5'><Flex>Sticky <Device /></Flex></Label>

            <SelectControl options={[{ label: 'None', value: '' }, { label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }]} value={sticky?.[device]} onChange={val => onChange({ ...motion, sticky: { ...sticky, [device]: val } })} />

        </Flex>

    </PanelBody>
}

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(AdvMotionEffects);