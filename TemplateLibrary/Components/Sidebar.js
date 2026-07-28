/**
	* Sidebar Component
	*
	* @props main (optional): Taxonomy/category data keyed by type (Object)
	* @props mainLoading (optional): Whether category data is loading (Boolean)
	* @props setTemplates (required): Templates list setter (Function)
	* @props type (optional): Active template type ('patterns' or 'pages') (String)
	* @props category (optional): Active category name (String)
	* @props setCategory (required): Category setter (Function)
	* @props access (optional): Active access filter ('all', 'free' or 'pro') (String)
	* @props setAccess (required): Access filter setter (Function)
	* @props accessCounts (optional): Precomputed counts by access and category (Object)
	* @props setPageNumber (required): Page number setter (Function)
	* @props setSearch (required): Search query setter (Function)
	*/

import { useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

import { debounce } from '../../utils/functions';
import { searchIcon } from '../../utils/icons';

const Sidebar = ({
	main,
	mainLoading,
	setTemplates,
	type,
	category,
	setCategory,
	access,
	setAccess,
	accessCounts,
	setPageNumber,
	setSearch,
	sidebarOpen,
}) => {
	const handleSearch = useMemo(() => debounce((sq) => {
		setSearch(sq);
		setPageNumber(1);
		setTemplates([]);
	}, 600), []);

	const handleInputChange = (e) => handleSearch(e.target.value);

	const { 'patterns-category': patternsCats = [], 'pages-category': pagesCats = [] } = main || {};
	const cats = 'pages' === type ? pagesCats : patternsCats;

	const ac = accessCounts;
	const taxPro = (cats || []).find((c) => c.name === 'pro')?.count ?? 0;

	const contentCats = (cats || []).filter((c) => 'free' !== c.name && 'pro' !== c.name);

	const taxTotal = contentCats.reduce((sum, cat) => sum + (cat.count ?? 0), 0) + taxPro;
	const taxFree = Number.isFinite(taxTotal) ? taxTotal - taxPro : undefined;

	const totalAll = ac ? ac.all : taxTotal;
	const totalFree = ac ? ac.free : taxFree;
	const totalPro = ac ? ac.pro : taxPro;

	const allCount = 'pro' === access ? totalPro : 'free' === access ? totalFree : totalAll;

	const catCount = (name) => {
		if (ac) {
			const c = ac.categories?.[name];
			if (!c) return undefined;
			return 'pro' === access ? c.pro : 'free' === access ? c.free : c.total;
		}
		return 'all' === access ? (cats || []).find((c) => c.name === name)?.count : undefined;
	};

	const categories = [{ label: __('All'), name: 'all' }, ...contentCats];

	const accessFilters = [
		{ name: 'all', label: __('All') },
		{ name: 'free', label: __('Free') },
		{ name: 'pro', label: __('Pro') }
	];

	const pickCategory = (name) => {
		if (name === category) return; // already active — avoid clearing without a refetch

		setCategory(name);
		setPageNumber(1);
		setTemplates([]);
	};

	const toggleAccess = (name) => {
		const next = access === name ? 'all' : name;
		setAccess(next);
		if ('all' === category && ('pro' === access) !== ('pro' === next)) {
			setPageNumber(1);
			setTemplates([]);
		}
	};

	const renderCount = (count) => (Number.isFinite(count) && count > 0 ? <span className='catCount'>{count}</span> : null);

	return <aside className={`modalBodySidebar ${sidebarOpen ? 'isOpen' : ''}`}>
		<div className='sidebarSearch'>
			<div onClick={handleInputChange} className='searchIconWrapper'>{searchIcon}</div>

			<input type='text' placeholder={__('Search templates…')} onChange={handleInputChange} />
		</div>

		<div className='sidebarAccess'>
			{accessFilters.map(({ name, label }) => <button
				key={name}
				className={`is-${name} ${access === name ? 'active' : ''}`}
				onClick={() => toggleAccess(name)}
				aria-pressed={access === name}
			>
				<span className='tick' aria-hidden='true' />
				<span>{label}</span>
			</button>)}
		</div>

		<div className='sidebarHeading'>{__('Categories')}</div>

		<div className='sidebarCategories'>
			{mainLoading ? <div className='bPlPlaceCenter'>
				<Spinner className='bPlSpinner' />
			</div> :
				categories.map(({ name, label }, i) => {
					const count = renderCount(name === 'all' ? allCount : catCount(name));

					return count && <button
						key={i}
						className={name === category ? 'active' : ''}
						onClick={() => pickCategory(name)}
					>
						<span className='catLabel' dangerouslySetInnerHTML={{ __html: label }} />
						{count}
					</button>
				})}
		</div>
	</aside>
};
export default Sidebar;
