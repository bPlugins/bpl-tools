/**
 * Device Component
 *
 * @props className (optional): (String)
 * @props style (optional): Inline style object (Object)
 * @props position (optional): 'horizontal' (String): 'horizontal': every device in a row; 'vertical': only the
 *        active one, a click on it reveals the others below it, a click on one switches to it
 * @props device (optional): The active device type (String)
 * @props setDevice (optional): (Function)
 * @props onChange (optional): (Function)
 */

import { useEffect, useRef, useState } from 'react';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

import './style.scss';

const Device = ({
	style,
	className = '',
	position = 'horizontal',
	device = 'desktop',
	setDevice,
	onChange = () => {},
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef(null);

	const deviceValue = [
		{ label: 'Desktop', name: 'desktop', icon: 'dashicons-desktop' },
		{ label: 'Tablet', name: 'tablet', icon: 'dashicons-tablet' },
		{ label: 'Mobile', name: 'mobile', icon: 'dashicons-smartphone' },
	];

	const isVertical = 'vertical' === position;
	const active =
		deviceValue.find(({ name }) => name === (device || '').toLowerCase()) ||
		deviceValue[0];

	// Vertical: close on outside click or Escape
	useEffect(() => {
		if (!isOpen || !isVertical) return undefined;

		const doc = ref.current?.ownerDocument || document;
		const canvasIframe = doc.querySelector('iframe[name="editor-canvas"]');
		const canvasDoc = canvasIframe?.contentDocument;

		const onOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		const onKey = (event) => {
			if ('Escape' === event.key) {
				setIsOpen(false);
			}
		};

		doc.addEventListener('mousedown', onOutside);
		doc.addEventListener('keydown', onKey);
		if (canvasDoc) {
			canvasDoc.addEventListener('mousedown', onOutside);
		}

		return () => {
			doc.removeEventListener('mousedown', onOutside);
			doc.removeEventListener('keydown', onKey);
			if (canvasDoc) {
				canvasDoc.removeEventListener('mousedown', onOutside);
			}
		};
	}, [isOpen, isVertical]);

	const handleSelect = (e, targetDevice) => {
		e.preventDefault();
		e.stopPropagation();

		if (isVertical && targetDevice.name === active.name) {
			setIsOpen((prev) => !prev);
			return;
		}

		if (setDevice) {
			setDevice(targetDevice.label);
		}
		onChange(targetDevice.name);
		setIsOpen(false);
	};

	const renderButton = (item, isTrigger = false) => {
		const { label, name, icon } = item;
		const isActive = name === active.name;

		return (
			<button
				key={name}
				type='button'
				className={`${isActive ? 'active' : ''} ${isTrigger && isOpen ? 'isOpen' : ''}`}
				aria-label={label}
				title={label}
				aria-expanded={isTrigger ? isOpen : undefined}
				onMouseDown={(e) => {
					e.stopPropagation();
				}}
				onClick={(e) => handleSelect(e, item)}
			>
				<span className={`dashicons ${icon} ${isActive ? 'active' : ''}`} />
			</button>
		);
	};

	return (
		<div
			ref={ref}
			className={`bPlDeviceControl ${isVertical ? 'bPlDeviceControlVertical' : ''} ${className}`}
			style={{
				display: isVertical ? 'inline-flex' : 'flex',
				...style,
			}}
			onMouseDown={(e) => e.stopPropagation()}
			onClick={(e) => e.stopPropagation()}
		>
			{isVertical ? (
				<>
					{renderButton(active, true)}
					{isOpen && (
						<div className='bPlDeviceControlList'>
							{deviceValue
								.filter(({ name }) => name !== active.name)
								.map((item) => renderButton(item, false))}
						</div>
					)}
				</>
			) : (
				deviceValue.map((item) => renderButton(item, false))
			)}
		</div>
	);
};

export default compose(
	withSelect((select, ownProps) => {
		const editor = select('core/editor');
		const editPost = select('core/edit-post');
		const getDeviceType =
			editor?.getDeviceType ||
			editPost?.getDeviceType ||
			editPost?.__experimentalGetPreviewDeviceType;

		return {
			device:
				ownProps.device !== undefined
					? ownProps.device?.toLowerCase()
					: getDeviceType
					? getDeviceType()?.toLowerCase()
					: 'desktop',
		};
	}),

	withDispatch((dispatch, ownProps) => {
		return {
			setDevice(device) {
				if (ownProps.setDevice) {
					return ownProps.setDevice(device);
				}
				const editor = dispatch('core/editor');
				const editPost = dispatch('core/edit-post');
				if (editor?.setDeviceType) {
					return editor.setDeviceType(device);
				}
				if (editPost?.setDeviceType) {
					return editPost.setDeviceType(device);
				}
				if (editPost?.__experimentalSetPreviewDeviceType) {
					return editPost.__experimentalSetPreviewDeviceType(device);
				}
			},
		};
	})
)(Device);