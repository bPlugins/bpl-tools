import { useState, useEffect } from 'react';

import './style.scss';
import Modal from './Components/Modal';
import Portal from './Components/Portal';
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
 * @param {ReactNode}	props.logo					- Logo to display in sevaral areas
 * @param {string}		props.buttonLabel			- Button text label
 * @param {string}		props.modalTitle			- Modal header title (e.g. "Templates Library")
 * @param {string}		props.nonce					- WordPress nonce for AJAX
 * @param {boolean}		props.isPremium				- Whether user has pro access
 * @param {object}		props.textDomain			- i18n text domain
 * @param {string}		props.ajaxActionMain		- AJAX action for categories (default: 'prefix_templates_main')
 * @param {string}		props.ajaxActionTemplates	- AJAX action for templates (default: 'prefix_templates')
 * @param {string}		props.ajaxActionImport		- AJAX action for import (default: 'prefix_template_import')
 * @param {string}		props.ajaxActionCounts		- AJAX action for counts (default: 'prefix_template_counts')
 * @param {string}		props.pricingUrl			- URL for "Get Pro" button
 * @param {string}		props.importButtonLabel		- Button text for import (default: 'Import')
 * @param {array}		props.types			- Array of tab names to display (default: ['patterns', 'pages'])
 */
const TemplateLibrary = ({
	logo,
	buttonLabel,
	modalTitle = 'Templates Library',
	nonce,
	isPremium = false,
	ajaxActionMain = 'prefix_templates_main',
	ajaxActionTemplates = 'prefix_templates',
	ajaxActionImport = 'prefix_template_import',
	ajaxActionCounts = 'prefix_template_counts',
	pricingUrl = 'https://bplugins.com/pricing/',
	types = ['patterns', 'pages'],
	perPage = 12
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
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(nonce, type, effectiveCategory, pageNumber, search, ajaxActionTemplates, perPage);

	const accessCounts = useAccessCounts(nonce, type, show, ajaxActionCounts);

	useEffect(() => {
		if (show && nonce) {
			refetchTemplates({ type, category: effectiveCategory, pageNumber: 1, search: '' });
		} else {
			// Reset state when modal closes
			setTemplates([]);
			setPageNumber(1);
		}
	}, [show]);

	useEffect(() => {
		if (pageNumber === 1) {
			setTemplates(fTemplates);
		} else if (fTemplates.length > 0) {
			setTemplates(prev => [...prev, ...fTemplates]);
		}
	}, [fTemplates]);

	return <>
		<button className='bPlTemplateLibraryButton' onClick={() => setShow(true)}>
			{logo}
			{buttonLabel}
		</button>

		<Portal show={show}>
			<Modal {...{
				isPremium,
				logo,
				show,
				setShow,
				main,
				mainLoading,
				templates,
				setTemplates,
				totalCount,
				templatesLoading,
				types,
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
				pricingUrl,
				perPage
			}} />
		</Portal>
	</>;
};
export default TemplateLibrary;