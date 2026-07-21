/**
	* Modal Component
	*
	* @props isPremium (optional): Whether pro access is active (Boolean)
	* @props show (required): Controls modal visibility (Boolean)
	* @props setShow (required): Modal visibility setter (Function)
	* @props setTemplates (required): Templates list setter (Function)
	* @props totalCount (required): Total number of available templates (Number)
	* @props templatesLoading (required): Whether templates are currently loading (Boolean)
	* @props setType (required): Template type setter (Function)
	* @props setCategory (required): Category setter (Function)
	* @props pageNumber (required): Current page number (Number)
	* @props setPageNumber (required): Page number setter (Function)
	* @props modalTitle (optional): 'Templates Library' (String)
	* @props types (optional): Array of tab names to display - ['patterns', 'pages'] (Array)
	*/

import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { Spinner, TabPanel } from '@wordpress/components';

import Sidebar from './Sidebar';
import Templates from './Templates';
import { closeIcon } from '../../utils/icons';

const Modal = (props) => {
	const {
		isPremium,
		logo,
		show,
		setShow,
		setTemplates,
		totalCount,
		templatesLoading,
		types = ['patterns', 'pages'],
		type,
		setType,
		category,
		setCategory,
		access,
		pageNumber,
		setPageNumber,
		modalTitle = 'Templates Library',
		perPage = 9,
		accessCounts
	} = props;

	const contentRef = useRef();

	// Total count matching the active category and access filters
	const getFilteredTotal = () => {
		if (!accessCounts) return totalCount;

		if ('all' !== category) {
			const catCounts = accessCounts.categories?.[category];
			if (!catCounts) return totalCount;
			return 'pro' === access ? catCounts.pro : 'free' === access ? catCounts.free : catCounts.total;
		}

		return 'pro' === access ? accessCounts.pro : 'free' === access ? accessCounts.free : accessCounts.all;
	};

	// Favorites tab always renders alongside the configured type tabs
	const tabs = [
		...types.map(tabName => ({
			name: tabName,
			title: (tabName || '').charAt(0).toUpperCase() + (tabName || '').slice(1)
		})),
		{ name: 'favorites', title: 'Favorites' }
	];

	const initialTabName = types[0] || 'patterns';

	useEffect(() => {
		if (!show) return undefined;

		const onMouseDown = (e) => {
			if (!contentRef.current?.contains(e.target)) {
				setShow(false);
			}
		};
		const onKeyDown = (e) => {
			if ('Escape' === e.key) setShow(false);
		};

		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [show, setShow]);

	return <div className='bPlTemplatesModal' style={{ visibility: show ? 'visible' : 'hidden' }} >
		<div ref={contentRef} role='dialog' aria-modal='true' aria-label={modalTitle} style={{ marginTop: show ? '0' : '50px', transition: 'margin 0.5s ease-out' }} className='modalContainer'>
			<header className='modalHeader'>
				<div className='modalHeaderBrand'>
					{logo} {modalTitle}
				</div>

				{tabs.length > 1 && <div className='modalHeaderTypes'>
					<TabPanel
						className='tabPanel autoTab'
						activeClass='activeTab'
						initialTabName={initialTabName}
						tabs={tabs}
						onSelect={tabName => {
							setType(tabName);
							setCategory('all');
							setPageNumber(1);
							setTemplates([]);
						}}
					>{() => <></>}</TabPanel>
				</div>}

				<div onClick={() => setShow(false)} className='modalHeaderClose' role='button' aria-label={__('Close')} tabIndex={0}>
					{closeIcon}
				</div>
			</header>

			{show && <div className='modalBody'>
				<Sidebar {...props} />

				<Templates {...props} {...{ setShow, isPremium, perPage }}>
					{'favorites' !== type && (templatesLoading || (perPage * pageNumber) < getFilteredTotal()) ?
						<div className='modalBodyBottom'>
							{templatesLoading ?
								<Spinner className='bPlSpinner' /> :
								<button className='templatesLoadMore' onClick={() => setPageNumber(prev => prev + 1)}>
									{__('Load More')}
								</button>}
						</div> :
						null}
				</Templates>
			</div>}
		</div>
	</div>;
};
export default Modal;
