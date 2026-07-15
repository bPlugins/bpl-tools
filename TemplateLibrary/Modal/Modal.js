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
	* @props patternsTabLabel (optional): 'Patterns' (String)
	* @props pagesTabLabel (optional): 'Pages' (String)
	* @props loadMoreButtonLabel (optional): 'Load More' (String)
	* @props allLabel (optional): 'All' (String)
	* @props freeLabel (optional): 'Free' (String)
	* @props proLabel (optional): 'Pro' (String)
	* @props categoriesHeadingLabel (optional): 'Categories' (String)
	* @props searchPlaceholder (optional): 'Search templates…' (String)
	*/

import { useEffect, useRef } from 'react';
import { Spinner, TabPanel } from '@wordpress/components';

import Sidebar from './Sidebar';
import Templates from './Templates';
import { closeIcon } from '../utils/icons';

const perPage = 9;

const Modal = (props) => {
	const {
		isPremium,
		show,
		setShow,
		setTemplates,
		totalCount,
		templatesLoading,
		setType,
		setCategory,
		pageNumber,
		setPageNumber,
		modalTitle = 'Templates Library',
		patternsTabLabel = 'Patterns',
		pagesTabLabel = 'Pages',
		loadMoreButtonLabel = 'Load More',
		allLabel = 'All',
		freeLabel = 'Free',
		proLabel = 'Pro',
		categoriesHeadingLabel = 'Categories',
		searchPlaceholder = 'Search templates…'
	} = props;

	const contentRef = useRef();
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
				<div className='modalHeaderTitle'>
					{modalTitle}
				</div>

				<div className='modalHeaderTypes'>
					<TabPanel
						className='tabPanel autoTab'
						activeClass='activeTab'
						initialTabName='patterns'
						tabs={[
							{ name: 'patterns', title: patternsTabLabel },
							{ name: 'pages', title: pagesTabLabel }
						]}
						onSelect={tabName => {
							setType(tabName);
							setCategory('all');
							setPageNumber(1);
							setTemplates([]);
						}}
					>{() => <></>}</TabPanel>
				</div>

				<div onClick={() => setShow(false)} className='modalHeaderClose'>{closeIcon}</div>
			</header>

			{show && <div className='modalBody'>
				<Sidebar {...props} allLabel={allLabel} freeLabel={freeLabel} proLabel={proLabel} categoriesHeadingLabel={categoriesHeadingLabel} searchPlaceholder={searchPlaceholder} />

				<Templates {...props} setShow={setShow} isPremium={isPremium}>
					<div className='modalBodyBottom'>
						{templatesLoading ? <div className='apbPlaceCenter'>
							<Spinner className='apbSpinner' />
						</div> : (perPage * pageNumber) < totalCount && <button className='modalBodyTemplateLoadMore libraryBtn active' onClick={() => setPageNumber(prev => prev + 1)}>{loadMoreButtonLabel}</button>}
					</div>
				</Templates>
			</div>}
		</div>
	</div>;
};
export default Modal;
