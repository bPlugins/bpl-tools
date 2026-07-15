/**
	* ProModal Component
	*
	* @props isProModalOpen (required): Controls modal visibility (Boolean)
	* @props setIsProModalOpen (required): Modal open state setter (Function)
	* @props link (optional): '' Upgrade link URL (String)
	* @props title (optional): Modal title, supports HTML (String)
	* @props description (optional): Modal description, supports HTML (String)
	* @props features (optional): List of feature strings (max 6 shown) (Array)
	*/

import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './style.scss';
import Button from '../../Components/Button/Button';

const ProModal = ({
	isProModalOpen,
	setIsProModalOpen,
	link = '',
	title = __('Unlock More with Plugin Pro!'),
	description = __(`The free features of Plugin do a lot-still, without PRO, you're holding yourself back from getting more.`),
	features = [
		__('Gain full access to all pro campaigns'),
		__('Create unlimited discount offers'),
		__('No campaign feature restrictions'),
		__('Fast support guaranteed'),
		__('Access New Pro features at launch'),
		__('Fluid experience ensured')
	]
}) => {
	if (!isProModalOpen) {
		return null;
	}

	return <Modal
		className='bplProModal'
		onRequestClose={() => setIsProModalOpen(false)}
		shouldCloseOnClickOutside={true}
		overlayClassName='bplProModalOverlay'
		__experimentalHideHeader={true}
	>
		<div className='left'>
			<div className='illustration'>
				<svg xmlns='http://www.w3.org/2000/svg' fillRule='evenodd' viewBox='0 0 512 512'>
					<path d='m320.9 491.64h-266.93c-29.74 0-53.94-24.2-53.94-53.94v-168.46c0-29.74 24.2-53.94 53.94-53.94h266.93c3.78 0 7.52.4 11.18 1.18.06 9.37 1.52 18.77 4.39 27.92l-3.99 6.93c-4.84 8.38-6.13 18.28-3.62 27.63 1.06 3.96 2.74 7.65 4.97 10.96l-66.83 115.75c-2.38 4.11-3.03 9.03-1.81 13.61l9.7 36.55c2.09 7.89 9.24 13.38 17.39 13.38 2.39 0 1.94.06 4.3-.52l32.59-8.01c4.7-1.16 8.74-4.16 11.2-8.32 2.33-3.94 3.06-8.63 2.07-13.07 4.17-1.39 7.69-4.26 9.9-8.08s2.93-8.33 2.04-12.63c4.17-1.38 7.71-4.25 9.92-8.08 2.21-3.82 2.93-8.33 2.04-12.63 3.37-1.12 6.32-3.2 8.5-5.98v45.81c0 29.74-24.2 53.94-53.94 53.94zm-133.46-49.19c-12.97 0-23.52-10.55-23.52-23.51v-64.84c-14.92-8.43-24.37-24.41-24.37-41.72 0-26.4 21.48-47.89 47.89-47.89 26.4 0 47.88 21.48 47.88 47.89 0 17.31-9.45 33.29-24.38 41.72v64.84c0 12.96-10.54 23.51-23.5 23.51zm0-165.95c-19.79 0-35.89 16.09-35.89 35.88 0 13.96 8.2 26.76 20.89 32.61 2.12.98 3.48 3.1 3.48 5.45v68.5c0 6.34 5.17 11.51 11.51 11.51 6.35 0 11.51-5.17 11.51-11.51v-68.5c0-2.35 1.37-4.47 3.49-5.45 12.69-5.85 20.89-18.65 20.89-32.61 0-19.79-16.1-35.88-35.88-35.88z' /><path d='m250.57 203.3v-50.24c0-34.82-28.32-63.14-63.14-63.14-34.81 0-63.13 28.32-63.13 63.14v50.24h-69.57v-50.24c0-73.17 59.53-132.7 132.7-132.7h.01c73.17 0 132.7 59.53 132.7 132.7v50.24z' />
					<path d='m413.54 322.58c-4.26 0-8.47-1.13-12.16-3.26l-49.57-28.62c-5.64-3.25-9.67-8.52-11.36-14.84s-.84-12.9 2.42-18.53l6.73-11.67c-9.01-23.7-6.96-49.69 5.78-71.75 14.95-25.89 42.83-41.98 72.76-41.98 14.64 0 29.13 3.89 41.88 11.26 40.08 23.14 53.86 74.57 30.72 114.64-12.73 22.06-34.21 36.84-59.25 40.88l-6.73 11.67c-4.35 7.53-12.48 12.2-21.22 12.2zm14.48-60.58c-8.05 0-16.01-2.13-23.02-6.18-22.03-12.72-29.6-40.98-16.88-63.01 8.21-14.23 23.53-23.07 39.98-23.07 8.05 0 16.01 2.14 23.02 6.18 10.67 6.17 18.31 16.11 21.5 28.01 3.18 11.91 1.55 24.34-4.61 35.01-8.22 14.22-23.54 23.06-39.99 23.06zm.08-80.26c-12.17 0-23.51 6.54-29.59 17.07-9.41 16.3-3.81 37.21 12.49 46.62 5.19 2.99 11.07 4.57 17.02 4.57 12.18 0 23.52-6.54 29.6-17.07 9.4-16.29 3.8-37.21-12.5-46.61-5.18-3-11.07-4.58-17.02-4.58z' />
					<path d='m292.28 457.21c-2.66 0-5.08-1.77-5.79-4.46l-9.7-36.54c-.41-1.54-.2-3.17.6-4.54l64.98-112.56 56.45 32.59-5.64 9.76c-.79 1.38-2.1 2.38-3.64 2.79l-13.94 3.74 2.83 10.54c.41 1.53.19 3.17-.61 4.55-.79 1.38-2.1 2.38-3.64 2.8l-10.54 2.82 2.83 10.54c.41 1.54.19 3.17-.6 4.55-.8 1.38-2.11 2.38-3.65 2.8l-10.54 2.82 2.83 10.54c.41 1.53.2 3.17-.6 4.55s-2.11 2.38-3.64 2.79l-10.54 2.83 2.82 10.54c.41 1.53.2 3.17-.6 4.55-.79 1.38-2.1 2.38-3.64 2.79l-10.54 2.83 2.9 10.82c.42 1.56.19 3.22-.63 4.6-.82 1.39-2.17 2.39-3.73 2.78l-32.6 8.01c-.47.12-.96.17-1.43.17z' />
				</svg>
			</div>
		</div>

		<div className='right'>
			<h2 dangerouslySetInnerHTML={{ __html: title }} />
			<p dangerouslySetInnerHTML={{ __html: description }} />

			<h3>{__('With PRO, You’ll Get:')}</h3>

			<ul>
				{features?.slice(0, 6).map((feature, index) => <li key={index}>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 15'>
						<path fillRule='evenodd' d='M7.5 15C8.48491 15 9.46018 14.806 10.3701 14.4291C11.2801 14.0522 12.1069 13.4997 12.8033 12.8033C13.4997 12.1069 14.0522 11.2801 14.4291 10.3701C14.806 9.46018 15 8.48491 15 7.5C15 6.51509 14.806 5.53982 14.4291 4.62987C14.0522 3.71993 13.4997 2.89314 12.8033 2.1967C12.1069 1.50026 11.2801 0.947814 10.3701 0.570903C9.46018 0.193993 8.48491 -1.46764e-08 7.5 0C5.51088 2.96403e-08 3.60322 0.790176 2.1967 2.1967C0.790176 3.60322 0 5.51088 0 7.5C0 9.48912 0.790176 11.3968 2.1967 12.8033C3.60322 14.2098 5.51088 15 7.5 15ZM7.30667 10.5333L11.4733 5.53333L10.1933 4.46667L6.61 8.76583L4.75583 6.91083L3.5775 8.08917L6.0775 10.5892L6.7225 11.2342L7.30667 10.5333Z' />
					</svg>

					<span dangerouslySetInnerHTML={{ __html: feature }} />
				</li>)}
			</ul>

			<Button href={link} target='_blank'>{__('Upgrade Now')}</Button>
		</div>

		<button
			className='close'
			onClick={() => setIsProModalOpen(false)}
			aria-label={__('Close modal')}
		>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
				<path d='M16 2C8.2 2 2 8.2 2 16C2 23.8 8.2 30 16 30C23.8 30 30 23.8 30 16C30 8.2 23.8 2 16 2ZM16 28C9.4 28 4 22.6 4 16C4 9.4 9.4 4 16 4C22.6 4 28 9.4 28 16C28 22.6 22.6 28 16 28Z' />
				<path d='M21.4 23L16 17.6L10.6 23L9 21.4L14.4 16L9 10.6L10.6 9L16 14.4L21.4 9L23 10.6L17.6 16L23 21.4L21.4 23Z' />
			</svg>
		</button>
	</Modal>
};
export default ProModal;