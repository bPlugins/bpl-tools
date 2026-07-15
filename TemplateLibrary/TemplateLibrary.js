import { useState, useEffect } from 'react';

import './TemplateLibrary.scss';
import Modal from './Modal/Modal';
import Portal from './Modal/Portal';
import useTemplatesMain from './hooks/useTemplatesMain';
import useTemplates from './hooks/useTemplates';
import useAccessCounts from './hooks/useAccessCounts';

/**
 * TemplateLibrary — Generic template library modal system for block plugins.
 *
 * Spread both `buttonConfig` and `ajaxConfig` as props:
 *	<TemplateLibrary {...buttonConfig} {...ajaxConfig} />
 *
 * @param {object}		props
 * @param {ReactNode}	props.buttonIcon			- Icon to display in button
 * @param {string}		props.buttonLabel			- Button text label
 * @param {string}		props.modalTitle			- Modal header title (e.g. "Templates Library")
 * @param {string}		props.nonce					- WordPress nonce for AJAX
 * @param {boolean}		props.isPremium				- Whether user has pro access
 * @param {object}		props.textDomain			- i18n text domain
 * @param {string}		props.ajaxActionMain		- AJAX action for categories (default: 'apb_templates_main')
 * @param {string}		props.ajaxActionTemplates	- AJAX action for templates (default: 'apb_templates')
 * @param {string}		props.ajaxActionImport		- AJAX action for import (default: 'apb_template_import')
 * @param {string}		props.ajaxActionCounts		- AJAX action for counts (default: 'apb_template_counts')
 * @param {string}		props.proProductUrl			- URL for "Get Pro" button
 * @param {string}		props.importButtonLabel		- Button text for import (default: 'Import')
 * @param {string}		props.proButtonLabel		- Button text for pro only (default: 'Get Pro')
 * @param {string}		props.noTemplatesText		- Text when no templates found (default: 'No Templates Found!!')
 * @param {string}		props.loadMoreButtonLabel	- Text for load more button
 * @param {string}		props.patternsTabLabel		- Label for patterns tab (default: 'Patterns')
 * @param {string}		props.pagesTabLabel			- Label for pages tab (default: 'Pages')
 * @param {string}		props.buttonClassName		- CSS class for button (default: 'templateLibraryButton')
 */
const TemplateLibrary = ({
	buttonIcon,
	buttonLabel,
	modalTitle = 'Templates Library',
	nonce,
	isPremium = false,
	ajaxActionMain = 'apb_templates_main',
	ajaxActionTemplates = 'apb_templates',
	ajaxActionImport = 'apb_template_import',
	ajaxActionCounts = 'apb_template_counts',
	proProductUrl = 'https://bplugins.com/products/advanced-post-block/',
	importButtonLabel = 'Import',
	proButtonLabel = 'Get Pro',
	noTemplatesText = 'No Templates Found!!',
	loadMoreButtonLabel = 'Load More',
	patternsTabLabel = 'Patterns',
	pagesTabLabel = 'Pages',
	buttonClassName = 'templateLibraryButton',
	allLabel = 'All',
	freeLabel = 'Free',
	proLabel = 'Pro',
	categoriesHeadingLabel = 'Categories',
	searchPlaceholder = 'Search templates…'
}) => {
	const [show, setShow] = useState(false);
	const [type, setType] = useState('patterns');
	const [category, setCategory] = useState('all');
	const [access, setAccess] = useState('all');
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');
	const [templates, setTemplates] = useState([]);

	const effectiveCategory = 'all' !== category ? category : ('pro' === access ? 'pro' : 'all');

	const { main, isLoading: mainLoading } = useTemplatesMain(nonce, type, ajaxActionMain);
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(nonce, type, effectiveCategory, pageNumber, search, ajaxActionTemplates);

	const accessCounts = useAccessCounts(nonce, type, show, ajaxActionCounts);

	useEffect(() => {
		if (show && nonce) {
			refetchTemplates({ type, category: effectiveCategory, pageNumber: 1, search: '' });
		}
	}, [show]);

	useEffect(() => {
		if (pageNumber === 1) {
			setTemplates(fTemplates);
		} else {
			setTemplates(prev => [...prev, ...fTemplates]);
		}
	}, [fTemplates, pageNumber]);

	return <>
		<button className='bPlTemplateLibraryButton' onClick={() => setShow(true)}>
			{buttonIcon}
			{buttonLabel}
		</button>

		<Portal show={show}>
			<Modal
				{...{
					isPremium,
					show,
					setShow,
					main,
					mainLoading,
					templates,
					setTemplates,
					totalCount,
					templatesLoading,
					type,
					refetchTemplates,
					setType,
					category,
					setCategory,
					access,
					setAccess,
					accessCounts,
					pageNumber,
					setPageNumber,
					search,
					setSearch,
					nonce,
					modalTitle,
					ajaxActionImport,
					proProductUrl,
					importButtonLabel,
					proButtonLabel,
					noTemplatesText,
					loadMoreButtonLabel,
					patternsTabLabel,
					pagesTabLabel,
					allLabel,
					freeLabel,
					proLabel,
					categoriesHeadingLabel,
					searchPlaceholder,
				}}
			/>
		</Portal>
	</>;
};
export default TemplateLibrary;
