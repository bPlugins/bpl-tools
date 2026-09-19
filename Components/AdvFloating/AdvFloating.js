import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import CustomPopover from '../CustomPopover/CustomPopover';
import Label from '../Label/Label';
import { flRotateRsVal, flScaleRsVal, flTranslateRsVal } from './utils/options';

const AdvFloating = ({ floating, onChange = () => { } }) => {
    const { translate = {}, rotate = {}, scale = {}, isEnabled = false } = floating;
    return <PanelBody className='bPlPanelBody' title='Floating Effects' initialOpen={false}>

        <ToggleControl className='mt10 mb10' label='Enable' value={isEnabled} checked={isEnabled} onChange={val => onChange({ ...floating, isEnabled: val })} />

        <CustomPopover value={translate || {}} resetValues={flTranslateRsVal} onClick={(val) => onChange({ ...floating, translate: val })} icon='edit' label='Translate'>

            <Label className='mt0'>Translate X</Label>

            <RangeControl label='From (px)' defaultValue={0} min={-100} max={100} value={translate?.x?.from} onChange={(val) => onChange({ ...floating, translate: { ...translate, x: { ...translate?.x, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={-100} max={100} value={translate?.x?.to} onChange={(val) => onChange({ ...floating, translate: { ...translate, x: { ...translate?.x, to: val } } })} />

            <Label className='mt10'>Translate Y</Label>

            <RangeControl label='From (px)' defaultValue={0} min={-100} max={100} value={translate?.y?.from} onChange={(val) => onChange({ ...floating, translate: { ...translate, y: { ...translate?.y, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={-100} max={100} value={translate?.y?.to} onChange={(val) => onChange({ ...floating, translate: { ...translate, y: { ...translate?.y, to: val } } })} />

            <RangeControl label='Duration (ms)' defaultValue={0} min={0} max={10000} value={translate?.duration} step={0.01} onChange={(val) => onChange({ ...floating, translate: { ...translate, duration: val } })} />

            <RangeControl label='Delay (ms)' defaultValue={0} min={0} max={10000} step={0.01} value={translate?.delay} onChange={(val) => onChange({ ...floating, translate: { ...translate, delay: val } })} />

        </CustomPopover>

        <CustomPopover value={rotate || {}} resetValues={flRotateRsVal} onClick={(val) => onChange({ ...floating, rotate: val })} icon='edit' label='Rotate'>

            <Label className='mt0'>Rotate X</Label>

            <RangeControl label='From (px)' defaultValue={0} min={-100} max={100} value={rotate?.x?.from} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, x: { ...rotate?.x, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={-100} max={100} value={rotate?.x?.to} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, x: { ...rotate?.x, to: val } } })} />

            <Label className='mt10'>Rotate Y</Label>

            <RangeControl label='From (px)' defaultValue={0} min={-100} max={100} value={rotate?.y?.from} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, y: { ...rotate?.y, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={-100} max={100} value={rotate?.y?.to} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, y: { ...rotate?.y, to: val } } })} />

            <Label className='mt10'>Rotate Z</Label>

            <RangeControl label='From (px)' defaultValue={0} min={-100} max={100} value={rotate?.z?.from} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, z: { ...rotate?.z, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={-100} max={100} value={rotate?.z?.to} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, z: { ...rotate?.z, to: val } } })} />

            <RangeControl label='Duration (ms)' defaultValue={0} min={0} max={10000} value={rotate?.duration} step={0.01} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, duration: val } })} />

            <RangeControl label='Delay (ms)' defaultValue={0} min={0} max={10000} step={0.01} value={rotate?.delay} onChange={(val) => onChange({ ...floating, rotate: { ...rotate, delay: val } })} />

        </CustomPopover>

        <CustomPopover value={scale || {}} resetValues={flScaleRsVal} onClick={(val) => onChange({ ...floating, scale: val })} icon='edit' label='
        Scale'>

            <Label className='mt0'>Scale Z</Label>

            <RangeControl label='From' defaultValue={0} min={0} max={5} value={scale?.z?.from} step={0.1} onChange={(val) => onChange({ ...floating, scale: { ...scale, z: { ...scale?.z, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={0} max={5} step={0.1} value={scale?.z?.to} onChange={(val) => onChange({ ...floating, scale: { ...scale, z: { ...scale?.z, to: val } } })} />

            <Label className='mt10'>Scale Y</Label>

            <RangeControl label='From (px)' defaultValue={0} min={0} max={5} step={0.1} value={scale?.y?.from} onChange={(val) => onChange({ ...floating, scale: { ...scale, y: { ...scale?.y, from: val } } })} />

            <RangeControl label='To (px)' defaultValue={0} min={0} max={5} step={0.1} value={scale?.y?.to} onChange={(val) => onChange({ ...floating, scale: { ...scale, y: { ...scale?.y, to: val } } })} />

            <RangeControl label='Duration (ms)' defaultValue={0} min={0} max={10000} value={scale?.duration} step={0.01} onChange={(val) => onChange({ ...floating, scale: { ...scale, duration: val } })} />

            <RangeControl label='Delay (ms)' defaultValue={0} min={0} max={10000} step={0.01} value={scale?.delay} onChange={(val) => onChange({ ...floating, scale: { ...scale, delay: val } })} />

        </CustomPopover>

    </PanelBody>;
}

export default AdvFloating;