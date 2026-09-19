import { Flex, Notice, PanelBody, SelectControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import Label from '../Label/Label';
import { positionType } from './utils/options';
import Device from '../Device/Device';
import { useState } from 'react';

const AdvPosition = ({ position = {}, onChange = () => { }, device }) => {
    const [tabs, setTabs] = useState({ horizontal: "left", vertical: 'top' });

    return <PanelBody className='bPlPanelBody' title='Position' initialOpen={false}>

        <Notice status='info' isDismissible={false}>Positioning may look slightly different in the editor than on the live site.</Notice>

        <Flex className='mt10'>
            <Label className='flex2'>{<Flex>Type <Device /></Flex>}</Label>
            <SelectControl options={positionType} value={position?.[device]?.type} onChange={val => onChange({ ...position, [device]: { ...position?.[device], type: val } })} />
        </Flex>

        <Label className='mt10'>{<Flex justify='flex-start' gap={10}>Horizontal <Device /></Flex>}</Label>
        <ToggleGroupControl className='flex1 mt5' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={tabs?.horizontal} onChange={(val) => setTabs({ ...tabs, horizontal: val })}>

            <ToggleGroupControlOption label="Left" value="left" />
            <ToggleGroupControlOption label="Right" value="right" />

        </ToggleGroupControl>

        {
            tabs?.horizontal == 'left' && <>
                <Label className='mt10'><Flex gap={10}>Left Offset <Device /></Flex></Label>
                <UnitControl value={position?.[device]?.horizontal?.left} onChange={val => onChange({ ...position, [device]: { ...position?.[device], horizontal: { ...position?.[device]?.horizontal, left: val } } })} />
            </>
        }

        {
            tabs?.horizontal == 'right' && <>
                <Label className='mt10'><Flex gap={10}>Right Offset <Device /></Flex></Label>
                <UnitControl value={position?.[device]?.horizontal?.right} onChange={val => onChange({ ...position, [device]: { ...position?.[device], horizontal: { ...position?.[device]?.horizontal, right: val } } })} />
            </>
        }

        <Label className='mt10'>{<Flex justify='flex-start' gap={10}>Vertical <Device /></Flex>}</Label>
        <ToggleGroupControl className='flex1 mt5' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={tabs?.vertical} onChange={(val) => setTabs({ ...tabs, vertical: val })}>

            <ToggleGroupControlOption label="Top" value="top" />
            <ToggleGroupControlOption label="Bottom" value="bottom" />

        </ToggleGroupControl>

        {
            tabs?.vertical == 'top' && <>
                <Label className='mt10'><Flex gap={10}>Top Offset <Device /></Flex></Label>
                <UnitControl value={position?.[device]?.vertical?.top} onChange={val => onChange({ ...position, [device]: { ...position?.[device], vertical: { ...position?.[device]?.vertical, top: val } } })} />
            </>
        }

        {
            tabs?.vertical == 'bottom' && <>
                <Label className='mt10'><Flex gap={10}>Bottom Offset <Device /></Flex></Label>
                <UnitControl value={position?.[device]?.vertical?.bottom} onChange={val => onChange({ ...position, [device]: { ...position?.[device], vertical: { ...position?.[device]?.vertical, bottom: val } } })} />
            </>
        }

    </PanelBody>

}

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(AdvPosition);