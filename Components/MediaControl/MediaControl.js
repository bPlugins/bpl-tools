import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, PanelRow, Placeholder, TextControl, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

import { Label } from '../index';
import './MediaControl.scss';

/**
 * MediaControl component
 * @param {string} className - The class name of the component
 * @param {string} label - The label of the component
 * @param {string} value - The value of the component
 * @param {Array} types - The allowed types of media
 * @param {function} onChange - The function to handle changes in the component value
 * @param {string} placeholder - The placeholder text of the component
 * @returns {JSX.Element} - The MediaUpload component
 */
export const InlineMediaUpload = props => {
	const { className, label = '', value, types = ['image'], onChange, placeholder = __('Enter URL') } = props;

	return <div className={className}>
		{label && <Label className='mb5'>{label}</Label>}

		<PanelRow className={`bPlInlineMediaUpload`}>
			<TextControl value={value} onChange={val => onChange(val)} placeholder={placeholder} />

			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={types}
					onSelect={val => onChange(val.url)}
					render={({ open }) => <Button className='button button-primary' onClick={open} icon={'upload'}></Button>}
				/>
			</MediaUploadCheck>
		</PanelRow>
	</div>
}

/**
 * InlineMediaUpload component props
 * @typedef {Object} InlineMediaUploadProps
 * @property {string} [className] - The class name of the component
 * @property {string} [label] - The label of the component
 * @property {string} [value] - The value of the component
 * @property {Array<string>} [types=['image']] - The allowed types of media
 * @property {(val: string) => void} [onChange] - The function to handle changes in the component value
 * @property {string} [placeholder=__('Enter URL')] - The placeholder text of the component
 */
export const InlineDetailMediaUpload = props => {
	const { className, label = '', value = {}, types = ['image'], onChange, placeholder = __('Enter URL') } = props;

	return <div className={className}>
		{label && <Label className='mb5'>{label}</Label>}

		<PanelRow className={`bPlInlineMediaUpload`}>
			<TextControl value={value?.url} onChange={url => onChange({ id: null, url, alt: '', title: '', caption: '' })} placeholder={placeholder} />

			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={types}
					onSelect={({ id, url, alt, title, caption }) => onChange({ id, url, alt, title, caption })}
					render={({ open }) => <Button className='button button-primary' onClick={open} icon={'upload'}></Button>}
				/>
			</MediaUploadCheck>
		</PanelRow>
	</div>
}

/**
 * MediaArea component props
 * @typedef {Object} MediaAreaProps
 * @property {string} [className] - The class name of the component
 * @property {string} [label='Choose'] - The label of the component
 * @property {Object} [value] - The value of the component
 * @property {Array<string>} [types=['image']] - The allowed types of media
 * @property {(val: Object) => void} [onChange] - The function to handle changes in the component value
 * @property {string} [default=''] - The default value of the component
 * @property {string} [height='50px'] - The height of the component
 * @property {string} [width='50px'] - The width of the component
 * @property {Object} [style] - The style of the component
 */
export const MediaArea = (props) => {
	const { className = '', label = 'Choose', value, types = ['image'], onChange = () => { }, default: defaults = '', height = '50px', width = '50px', style } = props;

	return <div style={style} className={`bPlMediaArea ${className}`}>
		<MediaUpload
			value={value}
			onSelect={(val) => onChange(val)}
			gallery={false}
			allowedTypes={types}
			multiple={false}
			render={({ open }) => <div className='mediaAreaContainer'>
				{defaults ?
					<img className='mediaImage' src={value?.url || defaults} alt='' onClick={open} style={{ height, width }} /> :

					value?.url ?
						<img className='mediaImage' src={value?.url || defaults} alt='' onClick={open} style={{ height, width }} /> :

						<div className='mediaPlusBtnWrapper' onClick={open}>
							<div className='mediaPlusBtnCircle'>
								<svg xmlns='http://www.w3.org/2000/svg' className='mediaPlusBtn' width='1em' height='1em' viewBox='0 0 448 512' fill='currentColor'>
									<path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
								</svg>
							</div>
						</div>
				}

				<div onClick={() => onChange({})} className='mediaDelete'>
					<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 448 512' fill='currentColor'>
						<path d='M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z' />
					</svg>
				</div>

				<div onClick={open} className='mediaButton'>
					<span>{label}</span>
				</div>
			</div>}
		/>
	</div>
};

/**
 * MediaArea component props:
 * @param {string} className optional: for customizing the component's outermost element
 * @param {string} label optional: for customizing the button label
 * @param {string|array} types optional: for customizing the types of files accepted
 * @param {func} onChange required: for handling the selected media
 * @param {string} default optional: for providing a default image URL
 * @param {string} height optional: for customizing the height of the image
 * @param {string} width optional: for customizing the width of the image
 * @param {object} style optional: for customizing the component's style
 */

export const MediaPlaceholder = props => {
	const { className = '', onChange, icon = 'format-image', type = 'image', typeName = '', placeholder = __('Paste or type a image URL') } = props;

	const [mediaSource, setMediaSource] = useState();

	return <Placeholder className={`bPlMediaPlaceholder ${className}`} label={__(`Upload ${typeName || type}`)}
		instructions={__(`Upload a ${typeName || type} or paste/write ${typeName || type} url to get started.`)}
		icon={icon}>
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={[type]}
				onSelect={val => onChange(val)}
				render={({ open }) => <Button isPrimary onClick={open}> {__('Upload')} </Button>}
			/>
		</MediaUploadCheck>

		<PanelRow className='bPlUrlInput'>
			<h3> {__('Or')} </h3>
			<input
				type='url'
				aria-label={__('URL')}
				placeholder={placeholder}
				onChange={src => setMediaSource(src.target.value)}
				value={mediaSource}
			/>
			<Button label={__('Apply')} type='submit' onClick={e => {
				e.preventDefault();
				onChange({ id: null, url: mediaSource, alt: '', title: '' });
				setMediaSource('');
			}} isPrimary>{__('Apply')}</Button>
		</PanelRow>
	</Placeholder>
}

/**
 * MediaEditControl component props:
 * @param {string} [label] - The label of the component
 * @param {string} [icon] - The icon of the component
 * @param {Array<string>} [types=['image']] - The allowed types of media
 * @param {Object} [value] - The value of the component
 * @param {(val: Object) => void} [onChange] - The function to handle changes in the component value
 * @param {boolean} [isMultiple=false] - Whether the component is for multiple media or not
 */
export const MediaEditControl = props => {
	const { label = __('Edit Image:'), icon = 'format-image', types = ['image'], value = {}, onChange, isMultiple = false } = props;

	const isRender = isMultiple ? value?.length : value?.url;

	return isRender && <ToolbarGroup className='bPlToolbar'>
		<MediaUploadCheck>
			<MediaUpload allowedTypes={types} value={isMultiple ? value.map(val => val.id) : value?.id} onSelect={val => onChange(val)} render={({ open }) => <ToolbarButton label={label} icon={icon} onClick={open} />} multiple={isMultiple} />
		</MediaUploadCheck>
	</ToolbarGroup>
};