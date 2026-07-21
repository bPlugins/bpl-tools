import { useState, useEffect, useMemo } from 'react';

import './style.scss';
import Modal from './Components/Modal';
import Portal from './Components/Portal';
import useTemplatesMain from './hooks/useTemplatesMain';
import useTemplates from './hooks/useTemplates';
import useAccessCounts from './hooks/useAccessCounts';
import useFavorites from './hooks/useFavorites';
import useFavoriteTemplates from './hooks/useFavoriteTemplates';

/**
 * TemplateLibrary — Generic template library modal system for block plugins.
 *
 * Spread both `buttonConfig` and `ajaxConfig` as props:
 *	<TemplateLibrary {...buttonConfig} {...ajaxConfig} />
 *
 * @param {object}		props
 * @param {string}		props.prefix				- Plugin prefix — drives the favorites option name ({prefix}FavoritesTemplates) and AJAX action ({prefix}_template_favorites)
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
	prefix = 'prefix',
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
	perPage = 9
}) => {
	const [show, setShow] = useState(false);
	const [type, setType] = useState('patterns');
	const [category, setCategory] = useState('all');
	const [access, setAccess] = useState('all');
	const [pageNumber, setPageNumber] = useState(1);
	const [search, setSearch] = useState('');
	const [templates, setTemplates] = useState([]);

	const isFavorites = 'favorites' === type;

	const effectiveCategory = 'all' !== category ? category : ('pro' === access ? 'pro' : 'all');

	const { main, isLoading: mainLoading } = useTemplatesMain(nonce, type, ajaxActionMain);
	const { templates: fTemplates, totalCount, refetchTemplates, isLoading: templatesLoading } = useTemplates(nonce, type, effectiveCategory, pageNumber, search, ajaxActionTemplates, perPage);

	const accessCounts = useAccessCounts(nonce, type, show && !isFavorites, ajaxActionCounts);

	const { favorites, toggleFavorite } = useFavorites(nonce, prefix, show);
	const { favTemplates, isLoading: favLoading } = useFavoriteTemplates(nonce, ajaxActionTemplates, favorites, show && isFavorites);

	// Favorites tab is filtered client-side (category & search); the access
	// filter is applied in the Templates component like everywhere else.
	const favVisible = useMemo(() => favTemplates.filter((item) => {
		if ('all' !== category && 'pro' !== category && !(item.category || []).includes(category)) return false;

		if (search) {
			const q = search.toLowerCase();
			const matches = (item.title || '').toLowerCase().includes(q)
				|| (item.category || []).some((c) => c.toLowerCase().includes(q))
				|| (item.keywords || []).some((k) => k.toLowerCase().includes(q));
			if (!matches) return false;
		}

		return true;
	}), [favTemplates, category, search]);

	// Sidebar counts for the favorites tab, computed from the favorite items.
	const favCounts = useMemo(() => {
		const counts = { all: 0, free: 0, pro: 0, categories: {} };

		favTemplates.forEach((item) => {
			const cats = item.category || [];
			const isPro = cats.includes('pro');

			counts.all++;
			counts[isPro ? 'pro' : 'free']++;

			cats.forEach((cat) => {
				if ('free' === cat || 'pro' === cat) return;
				counts.categories[cat] = counts.categories[cat] || { total: 0, free: 0, pro: 0 };
				counts.categories[cat].total++;
				counts.categories[cat][isPro ? 'pro' : 'free']++;
			});
		});

		return counts;
	}, [favTemplates]);

	// Category list for the favorites sidebar, derived from the favorite items
	// (so it isn't polluted with categories that have no favorites). Labels are
	// reused from the real taxonomy when available, else fall back to the slug.
	const favMain = useMemo(() => {
		const labelOf = {};
		['patterns-category', 'pages-category'].forEach((key) => {
			(main?.[key] || []).forEach((c) => { labelOf[c.name] = c.label; });
		});

		return {
			'patterns-category': Object.keys(favCounts.categories).map((name) => ({
				name,
				label: labelOf[name] || name,
				count: favCounts.categories[name].total
			}))
		};
	}, [favCounts, main]);

	useEffect(() => {
		if (show && nonce && !isFavorites) {
			refetchTemplates({ type, category: effectiveCategory, pageNumber: 1, search: '' });
		} else if (!show) {
			// Reset all filter state when the modal closes so the next open is clean
			setTemplates([]);
			setPageNumber(1);
			setType(types[0] || 'patterns');
			setCategory('all');
			setAccess('all');
			setSearch('');
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
		<button className='bPlTemplatesButton' onClick={() => setShow(true)}>
			{logo}
			{buttonLabel}
		</button>

		<Portal show={show}>
			<Modal {...{
				isPremium,
				logo,
				show,
				setShow,
				main: isFavorites ? favMain : main,
				mainLoading: isFavorites ? false : mainLoading,
				templates: isFavorites ? favVisible : templates,
				setTemplates,
				totalCount,
				templatesLoading: isFavorites ? favLoading : templatesLoading,
				types,
				type,
				refetchTemplates,
				setType,
				category,
				setCategory,
				access,
				setAccess,
				accessCounts: isFavorites ? favCounts : accessCounts,
				pageNumber,
				setPageNumber,
				search,
				setSearch,
				nonce,
				modalTitle,
				ajaxActionImport,
				pricingUrl,
				perPage,
				favorites,
				toggleFavorite
			}} />
		</Portal>
	</>;
};
export default TemplateLibrary;