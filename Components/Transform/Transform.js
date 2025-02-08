import { PanelBody, PanelRow, RangeControl, TabPanel, ToggleControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { normalHoverTabs } from '../../utils/options';
import CustomPopover from '../CustomPopover/CustomPopover';
import Device from '../Device/Device';
import Label from "../Label/Label";
import { offsetResetValue, rotateResetValue, scaleResetValue, skewResetValue } from './utils/options';

const Transform = ({ transform = {}, onChange = () => { }, device }) => {
  const { normal, hover,transition } = transform || {}
  return <PanelBody className="bPlPanelBody" title="Transform" initialOpen={false}>
        <TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={normalHoverTabs}>
          {tab => <>
            {tab.name === "normal" && <TransformOptions value={normal} device={device} onChange={value => onChange({ ...transform, normal: value })} />}
            {tab.name === "hover" && <>
              <TransformOptions value={hover} device={device} onChange={value => onChange({ ...transform, hover: value })} />
              <RangeControl className="bPlPanelBody" label="Transition Duration (ms)" value={transition} max={10000} onChange={(val) => onChange({ ...transform, transition:val})} />
            </>
            }
          </>
          }
        </TabPanel>
      </PanelBody>
};

export default compose(
  withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })
)(Transform);


const TransformOptions = ({ value, onChange = () => { }, device }) => {
  const { rotate = {}, offset = {}, scale = {}, skew = {}, flipX = {}, flipY = {} } = value || {};
  return <>
    <CustomPopover value={rotate} onClick={(val) => onChange({ ...value, rotate: val })} icon="edit" label="Rotate" resetValues={rotateResetValue}>
      <PanelRow>
        <Label className="mt0">Rotate (deg)</Label>
        <Device />
      </PanelRow>
      <RangeControl className="bPlPanelBody" value={rotate?.[device]?.z} min={-360} max={360} onChange={(val) => onChange({ ...value, rotate: { ...value.rotate, [device]: { ...value.rotate[device], z: val } } })}
      />
      <ToggleControl className="bPlPanelBody" label="3D Rotate" defaultChecked={false} defaultValue={false} checked={rotate?.threeDRotate} value={rotate?.threeDRotate} onChange={(val) => onChange({ ...value, rotate: { ...value.rotate, threeDRotate: val } })}
      />
      {rotate?.threeDRotate && (<> <PanelRow>
        <Label className="mt0">Rotate X (deg)</Label> <Device /> </PanelRow>
        <RangeControl className="bPlPanelBody" value={rotate?.[device]?.x} min={-360} max={360} onChange={(val) => onChange({ ...value, rotate: { ...value.rotate, [device]: { ...value.rotate[device], x: val } } })} />
        <PanelRow> <Label className="mt0">Rotate Y (deg)</Label> <Device /> </PanelRow>
        <RangeControl className="bPlPanelBody" value={rotate?.[device]?.y} min={-360} max={360} onChange={(val) => onChange({ ...value, rotate: { ...value.rotate, [device]: { ...value.rotate[device], y: val } } })} /> </>
      )}
    </CustomPopover>

    <CustomPopover value={offset} resetValues={offsetResetValue} onClick={(val) => onChange({ ...value, offset: val })} className="bPlPanelBody" icon="edit" label="Offset">
      <PanelRow> <Label className="mt0">Offset X</Label> <Device />
      </PanelRow>
      <UnitControl value={offset?.[device]?.x} min={-1000} max={1000} onChange={(val) => onChange({ ...value, offset: { ...value.offset, [device]: { ...value.offset[device], x: val } } })}
      />
      <PanelRow> <Label className="mt0">Offset Y</Label> <Device />
      </PanelRow>
      <UnitControl className="bPlPanelBody" value={offset?.[device]?.y} min={-1000} max={1000} onChange={(val) => onChange({ ...value, offset: { ...value.offset, [device]: { ...value.offset[device], y: val } } })}
      />
    </CustomPopover>

    <CustomPopover value={scale} resetValues={scaleResetValue} onClick={(val) => onChange({ ...value, scale: val })}  icon="edit" label="Scale">
      <ToggleControl className="bPlPanelBody" label="Keep Proportions" defaultChecked={false} defaultValue={false} checked={scale?.isProportion} value={scale?.isProportion} onChange={(val) => onChange({ ...value, scale: { ...value.scale, isProportion: val } })}
      />

      {scale?.isProportion ? (<> <PanelRow> <Label className="mt0">Scale</Label> <Device /> </PanelRow> <RangeControl className="bPlPanelBody" value={scale?.[device]?.scale} step={0.1} min={0} max={5} onChange={(val) => onChange({ ...value, scale: { ...value.scale, [device]: { ...value.scale[device], scale: val } } })} /> </>
      ) : (<>
        <PanelRow> <Label className="mt0">Scale X</Label> <Device /> </PanelRow>
        <RangeControl className="bPlPanelBody" value={scale?.[device]?.x} step={0.1} min={0} max={5} onChange={(val) => onChange({ ...value, scale: { ...value.scale, [device]: { ...value.scale[device], x: val } } })} />
        <PanelRow>
          <Label className="mt0">Scale Y</Label>
          <Device />
        </PanelRow>
        <RangeControl className="bPlPanelBody" value={scale?.[device]?.y} step={0.1} min={0} max={5} onChange={(val) => onChange({ ...value, scale: { ...value.scale, [device]: { ...value.scale[device], y: val }, }, })} /> </>
      )}
    </CustomPopover>

    <CustomPopover value={skew} resetValues={skewResetValue} onClick={(val) => onChange({ ...value, skew: val })}  icon="edit" label="Skew">
      <PanelRow> <Label className="mt0">Skew X (deg)</Label> <Device />
      </PanelRow>
      <RangeControl className="bPlPanelBody" defaultValue={0} min={-360} max={360} value={skew?.[device]?.x} onChange={(val) => onChange({ ...value, skew: { ...value.skew, [device]: { ...value.skew[device], x: val } } })}
      />
      <PanelRow> <Label className="mt0">Skew Y (deg)</Label> <Device />
      </PanelRow>
      <RangeControl className="bPlPanelBody" defaultValue={0} min={-360} max={360} value={skew?.[device]?.y} onChange={(val) => onChange({ ...value, skew: { ...value.skew, [device]: { ...value.skew[device], y: val } } })}
      />
    </CustomPopover>

    <ToggleControl className="bPlPanelBody" label="Flip Horizontal" checked={flipX} value={flipX} onChange={(val) => onChange({ ...value, flipX: val })} />
    <ToggleControl className="bPlPanelBody" label="Flip Vertical" checked={flipY} value={flipY} onChange={(val) => onChange({ ...value, flipY: val })}
    />

  </>
}
