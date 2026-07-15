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
	* @props allLabel (optional): 'All' (String)
	* @props freeLabel (optional): 'Free' (String)
	* @props proLabel (optional): 'Pro' (String)
	* @props categoriesHeadingLabel (optional): 'Categories' (String)
	* @props searchPlaceholder (optional): 'Search templates…' (String)
	*/

import { useMemo } from 'react';
import { Spinner } from '@wordpress/components';

import { debounce } from '../../utils/functions';

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
	allLabel = 'All',
	freeLabel = 'Free',
	proLabel = 'Pro',
	categoriesHeadingLabel = 'Categories',
	searchPlaceholder = 'Search templates…'
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

	const categories = [{ label: allLabel, name: 'all' }, ...contentCats];

	const accessFilters = [
		{ name: 'all', label: allLabel },
		{ name: 'free', label: freeLabel },
		{ name: 'pro', label: proLabel },
	];

	const pickCategory = (name) => {
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

	return (
		<aside className='modalBodySidebar'>
			<div className='modalBodySidebarSearch'>
				<svg onClick={handleInputChange} xmlns='http://www.w3.org/2000/svg' height='16' width='16' viewBox='0 0 512 512'>
					<path d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z' />
				</svg>

				<input type='text' placeholder={searchPlaceholder} onChange={handleInputChange} />
			</div>

			<div className='modalBodySidebarAccess'>
				{accessFilters.map(({ name, label }) => (
					<button
						key={name}
						className={`is-${name} ${access === name ? 'active' : ''}`}
						onClick={() => toggleAccess(name)}
						aria-pressed={access === name}
					>
						<span className='tick' aria-hidden='true' />
						<span>{label}</span>
					</button>
				))}
			</div>

			<div className='modalBodySidebarHeading'>{categoriesHeadingLabel}</div>

			<div className='modalBodySidebarCategories'>
				{mainLoading ? <div className='bPlPlaceCenter'>
					<Spinner className='bPlSpinner' />
				</div> :
					categories.map(({ name, label }, i) => (
						<button
							key={i}
							className={name === category ? 'active' : ''}
							onClick={() => pickCategory(name)}
						>
							<span className='catLabel' dangerouslySetInnerHTML={{ __html: label }} />
							{renderCount(name === 'all' ? allCount : catCount(name))}
						</button>
					))}
			</div>
		</aside>
	);
};
export default Sidebar;
