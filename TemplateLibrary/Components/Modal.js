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
import { Spinner, TabPanel } from '@wordpress/components';

import Sidebar from './Sidebar';
import Templates from './Templates';
import { closeIcon } from '../../utils/icons';

const perPage = 12;

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
		setType,
		setCategory,
		pageNumber,
		setPageNumber,
		modalTitle = 'Templates Library',
		perPage = 12,
		accessCounts
	} = props;

	const loadMoreButtonLabel = 'Load More';

	const contentRef = useRef();

	const tabs = types.map(tabName => ({
		name: tabName,
		title: (tabName || '').charAt(0).toUpperCase() + (tabName || '').slice(1)
	}));

	const initialTabName = types[0] || 'patterns';

	useEffect(() => {
		let handler = (e) => {
			if (!contentRef.current?.contains(e.target)) {
				setShow(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => {
			document.removeEventListener('mousedown', handler);
		};
	});

	return <div className='bPlTemplateLibraryModalWrap' style={{ visibility: show ? 'visible' : 'hidden' }} >
		<div ref={contentRef} style={{ marginTop: show ? '0' : '50px', transition: 'margin 0.5s ease-out' }} className='modalContainer'>
			<header className='modalHeader'>
				<div className='modalHeaderBrand'>
					{logo} {modalTitle}
				</div>

				{types.length > 1 && <div className='modalHeaderTypes'>
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

				<div onClick={() => setShow(false)} className='modalHeaderClose'>{closeIcon}</div>
			</header>

			{show && <div className='modalBody'>
				<Sidebar {...props} />

				<Templates {...props} setShow={setShow} isPremium={isPremium} perPage={perPage}>
					<div className='modalBodyBottom'>
						{(perPage * pageNumber) < (accessCounts?.all || totalCount) && <button className='modalBodyTemplateLoadMore libraryBtn active' disabled={templatesLoading} onClick={() => setPageNumber(prev => prev + 1)}>
							{templatesLoading ? <Spinner className='bPlSpinner' /> : loadMoreButtonLabel}
						</button>}
					</div>
				</Templates>
			</div>}
		</div>
	</div>;
};
export default Modal;
