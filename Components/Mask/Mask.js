import { PanelBody, PanelRow, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import React from 'react';
import { Label, MediaArea } from '../../../../../bpl-tools/Components';
import { positionOptions, repeatOptions, shapeOptions, sizeOptions } from './utils/options';

const Mask = ({ value, onChange }) => {
  const { isMask, shape, size, position, repeat } =value || {
    isMask: true,
    shape: {type:"circle",url:""},
    size: {
      type: "center center",
      scale:"100%"
    },
    position: {
      type:"center center",
      x:50,
    y:50
    },
    repeat: "no-repeat",
  }
  return (
    <PanelBody className="bPlPanelBody" title="Mask" initialOpen={true}>
      <ToggleControl className='mb10' label="Mask" checked={isMask} value={isMask} onChange={val => onChange({ ...value, isMask: val })} />
      {isMask && <>
        <PanelRow>
          <Label className="">Shape</Label>
      <SelectControl options={shapeOptions} value={shape.type} onChange={val => onChange({ ...value, shape: {...value.shape, type: val } })} />
        </PanelRow>
      {
        shape.type === "custom" && <MediaArea value={{ url: shape.url }} onChange={val => onChange({ ...value, shape: {...value.shape, url: val.url } })} />
        }
        <PanelRow className="mt10">
          <Label className="">Size</Label>
      <SelectControl  options={sizeOptions} value={size.type} onChange={val => onChange({ ...value, size: {...value.size, type: val } })} />
        </PanelRow>
      {
        size.type === "custom" && <UnitControl label="Size" labelPosition="edge" min={0} max={200} value={size.scale} onChange={val => onChange({ ...value, size: {...value.size, scale: val } })} />
        }
        <PanelRow>
          <Label className="">Position</Label>
      <SelectControl options={positionOptions} value={position.type} onChange={val => onChange({ ...value, position: {...value.position, type: val } })} />
        </PanelRow>
      {
        position.type ==="custom" && <>
          <UnitControl className="mt10" label="Position X" labelPosition="edge" min={-100} max={100} value={position.x} onChange={val => onChange({ ...value, position: {...value.position, x: val } })} />
          <UnitControl className="mt10" label="Position Y" labelPosition="edge" min={-100} max={100} value={position.y} onChange={val => onChange({ ...value, position: {...value.position, y: val } })} />
        </>
      }
      {size.type !== "cover"&&<PanelRow>
          <Label className="">Repeat</Label>
      <SelectControl options={repeatOptions} value={repeat} onChange={val=> onChange({ ...value, repeat: val })} />
        </PanelRow>}
      </>}
    </PanelBody>
  );
};

export default Mask;