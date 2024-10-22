/**
 * @props className (optional): 'mt20' (String)
 * @props label (optional): 'Background' (String)
 * @props background (required): { type, color, gradient, image, position, attachment, repeat, size, overlayColor } (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { type, color, gradient, image, position, attachment, repeat, size, overlayColor } (Object)
 */

import { __ } from '@wordpress/i18n';
import { Button, PanelRow, Dropdown, __experimentalGradientPicker, GradientPicker, __experimentalAlignmentMatrixControl as AlignmentMatrixControl, SelectControl } from '@wordpress/components';
const Gradient = __experimentalGradientPicker || GradientPicker;

import { Label, ColorControl, BtnGroup, InlineDetailMediaUpload } from '../index';
import { gradients } from '../../utils/options';
import { bgTypes, attachments, repeats, sizes } from './options';

const Background = props => {
	const { className = '', label = __('Background'), value = {}, onChange, defaults = {}, isSolid = true, isGradient = true, isImage = true } = props;

	const defaultVal = { type: 'solid', color: '#000000b3', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)', image: {}, position: 'center center', attachment: 'initial', repeat: 'no-repeat', size: 'cover', overlayColor: '#000000b3' }

	const getDefault = property => defaults?.[property] || defaultVal[property];
	const setDefault = property => onChange({ ...value, [property]: getDefault(property) });

	const getValue = property => value?.[property] || getDefault(property);
	const setValue = (property, val) => onChange({ ...value, [property]: val });

	const resetValue = property => value?.[property] && value?.[property] !== getDefault(property) ? <Button icon='image-rotate' className='bPlResetVal' onClick={() => setDefault(property)} /> : null

	return <PanelRow className={`bPlDropdown ${className}`}>
		<Label className='mb5'>{label}</Label>

		<Dropdown className='bPlDropdownContainer' contentClassName='bPlDropdownPopover' popoverProps={{ placement: 'bottom-end' }}
			renderToggle={({ isOpen, onToggle }) => <Button icon='edit' onClick={onToggle} aria-expanded={isOpen} />}
			renderContent={() => <>
				{/* Type */}
				<PanelRow>
					<Label className=''>{__('Type:')}</Label>
					<BtnGroup value={getValue('type')} onChange={val => setValue('type', val)} options={bgTypes.filter(bgType => {
						switch (bgType.value) {
							case 'solid':
								return isSolid;
							case 'gradient':
								return isGradient;
							case 'image':
								return isImage;
							default:
								return true;
						}
					})} />
				</PanelRow>

				{'solid' === getValue('type') && isSolid && <ColorControl className='mt20' label={__('Color:')} value={getValue('color')} onChange={val => setValue('color', val)} defaultColor={getDefault('color')} />}

				{'gradient' === getValue('type') && isGradient && <Gradient className='mt20' value={getValue('gradient')} onChange={val => setValue('gradient', val)} gradients={gradients} />}

				{'image' === getValue('type') && isImage && <>
					<Label className='mb5'>{__('Image')}</Label>
					<InlineDetailMediaUpload types={['image']} value={getValue('image')} onChange={val => setValue('image', val)} />

					<PanelRow>
						<Label className=''>{__('Position')}</Label>
						<AlignmentMatrixControl value={getValue('position')} onChange={val => setValue('position', val)} />
						{resetValue('position')}
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Attachment:')}</Label>
						<SelectControl value={getValue('attachment')} onChange={val => setValue('attachment', val)} options={attachments} />
						{resetValue('attachments')}
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Repeat:')}</Label>
						<SelectControl value={getValue('repeat')} onChange={val => setValue('repeat', val)} options={repeats} />
						{resetValue('repeat')}
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Size:')}</Label>
						<SelectControl value={getValue('size')} onChange={val => setValue('size', val)} options={sizes} />
						{resetValue('size')}
					</PanelRow>

					<ColorControl className='mt20' label={__('Overlay Color:')} value={getValue('overlayColor')} onChange={val => setValue('overlayColor', val)} defaultColor={getDefault('overlayColor')} />
				</>}
			</>}
		/>
	</PanelRow>
};
export default Background;