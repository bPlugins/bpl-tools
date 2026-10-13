/**
	* Demos Component
	*
	* @props name (required): plugin name shown in the page heading (String)
	* @props isPremium (required): whether the plugin is premium (Boolean)
	* @props demoInfo (required): {demos, allInOneLabel?, allInOneLink?} demo data (Object)
	*/

import { __, _n, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { useEffect, useMemo, useState } from 'react';

import { searchIcon, closeIcon, externalIcon, arrowRightIcon, chevronLeftIcon, chevronRightIcon } from '../utils/icons';

import './style.scss';

const CATEGORY_COLORS = [
	'#3b82f6', // blue
	'#10b981', // emerald
	'#8b5cf6', // violet
	'#f59e0b', // amber
	'#ec4899', // pink
	'#06b6d4', // cyan
	'#f43f5e', // rose
	'#14b8a6', // teal
];

const Demos = ({ name, isPremium, demoInfo }) => {
	const { demos } = demoInfo;

	const [activeCategory, setActiveCategory] = useState('All');
	const [search, setSearch] = useState('');
	const [openIndex, setOpenIndex] = useState(null);
	const [iframeLoading, setIframeLoading] = useState(false);

	const categories = useMemo(() => [
		'All',
		...demos.filter(d => d.children?.length > 0 || (d.url && d.url !== '#')).map(d => d.title)
	], [demos]);

	const categoryAccents = useMemo(() => {
		const map = {};
		const activeCats = categories.filter(cat => cat !== 'All');
		activeCats.forEach((cat, index) => {
			map[cat] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
		});
		return map;
	}, [categories]);

	const allCards = useMemo(() => {
		const cards = [];
		demos.forEach(demo => {
			const accent = categoryAccents[demo.title];
			const processCard = (cardData) => ({
				...cardData,
				category: demo.title,
				categoryIcon: demo.icon,
				accent,
				_searchTarget: `${cardData.title.toLowerCase()} ${demo.title.toLowerCase()}`
			});

			if (demo.children?.length) {
				demo.children.forEach(child => cards.push(processCard(child)));
			} else if (demo.url && demo.url !== '#') {
				cards.push(processCard(demo));
			}
		});
		return cards;
	}, [demos, categoryAccents]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return allCards.filter(card => {
			if (activeCategory !== 'All' && card.category !== activeCategory) return false;
			if (q && !card._searchTarget.includes(q)) return false;
			return true;
		});
	}, [allCards, activeCategory, search]);

	const active = openIndex !== null ? filtered[openIndex] : null;

	// One whole sentence per filter combination. The search term is user input,
	// so it goes in as an element rather than into the parsed string.
	const countText = (() => {
		const count = filtered.length;
		const inCategory = activeCategory !== 'All';
		const isSearching = !!search.trim();

		if (inCategory && isSearching) {
			return sprintf(
				/* translators: 1: Number of demos, 2: Demo category name. <search /> is replaced with the search term. */
				_n('<strong>%1$d</strong> demo in %2$s matching "<search />"', '<strong>%1$d</strong> demos in %2$s matching "<search />"', count),
				count,
				activeCategory
			);
		}

		if (inCategory) {
			return sprintf(
				/* translators: 1: Number of demos, 2: Demo category name. */
				_n('<strong>%1$d</strong> demo in %2$s', '<strong>%1$d</strong> demos in %2$s', count),
				count,
				activeCategory
			);
		}

		if (isSearching) {
			return sprintf(
				/* translators: %d: Number of demos. <search /> is replaced with the search term. */
				_n('<strong>%d</strong> demo matching "<search />"', '<strong>%d</strong> demos matching "<search />"', count),
				count
			);
		}

		return sprintf(
			/* translators: %d: Number of demos. */
			_n('<strong>%d</strong> demo', '<strong>%d</strong> demos', count),
			count
		);
	})();

	useEffect(() => {
		if (active) setIframeLoading(true);
	}, [active?.url]);

	const isModalOpen = openIndex !== null;

	useEffect(() => {
		if (!isModalOpen) return;
		const handler = (e) => {
			if (e.key === 'Escape') setOpenIndex(null);
			if (e.key === 'ArrowRight') setOpenIndex(i => Math.min(i + 1, filtered.length - 1));
			if (e.key === 'ArrowLeft') setOpenIndex(i => Math.max(i - 1, 0));
		};
		document.addEventListener('keydown', handler);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', handler);
			document.body.style.overflow = '';
		};
	}, [isModalOpen, filtered.length]);

	return <div className='bPlDashboardDemos'>
		<header className='hero'>
			<span className='eyebrow'>{__('Live Demos')}</span>
			<h1>{sprintf(
				/* translators: %s: Plugin name. */
				__('See the %s in action'),
				name
			)}</h1>
			<p>{__('Browse ready-made demos - click any card to open a live, interactive preview.')}</p>
		</header>

		<div className='toolbar'>
			<div className='search'>
				{searchIcon}
				<input
					type='text'
					value={search}
					placeholder={__('Search demos…')}
					onChange={e => setSearch(e.target.value)}
				/>
				{search && <button className='searchClear' onClick={() => setSearch('')} aria-label={__('Clear search')}>×</button>}
			</div>

			<div className='chips' role='tablist'>
				{categories.map(cat => <button
					key={cat}
					type='button'
					role='tab'
					aria-selected={activeCategory === cat}
					className={`chip ${activeCategory === cat ? 'isActive' : ''}`}
					style={cat !== 'All' ? { '--accent': categoryAccents[cat] } : undefined}
					onClick={() => setActiveCategory(cat)}
				>
					<span className='chipDot' />
					{'All' === cat ? __('All') : cat}
				</button>)}
			</div>
		</div>

		<p className='count'>
			{createInterpolateElement(countText, { strong: <strong />, search: <>{search}</> })}
		</p>

		{filtered.length === 0
			? <div className='empty'>
				{searchIcon}
				<h3>{__('No demos found')}</h3>
				<p>{__('Try a different search or category.')}</p>
			</div>
			: <div className='grid'>
				{filtered.map((card, i) => <button
					key={`${card.title}-${i}`}
					type='button'
					className='card'
					style={card.accent ? { '--accent': card.accent } : undefined}
					onClick={() => setOpenIndex(i)}
				>
					{card.categoryIcon && (
						<div className='cardIcon'>
							{'string' === typeof card.categoryIcon
								? <span dangerouslySetInnerHTML={{ __html: card.categoryIcon }} />
								: card.categoryIcon}
						</div>
					)}
					<span className='cardCat'>{card.category}</span>
					<h3 className='cardTitle'>{card.title}</h3>
					<span className='cardAction'>
						{__('Preview')}
						{arrowRightIcon}
					</span>
				</button>)}
			</div>
		}

		{active && <div className='modal' role='dialog' aria-modal='true'>
			<div className='modalBackdrop' onClick={() => setOpenIndex(null)} />

			<div className='modalContent'>
				<header className='modalHead'>
					<div className='modalTitleWrap'>
						{active.accent && <span className='modalCat' style={{ background: active.accent }}>{active.category}</span>}
						<h2>{active.title}</h2>
						<span className='modalProgress'>{sprintf(
							/* translators: 1: Current demo position, 2: Total number of demos. */
							__('%1$d of %2$d'),
							openIndex + 1,
							filtered.length
						)}</span>
					</div>

					<div className='modalActions'>
						<a className='modalOpen' href={active.url} target='_blank' rel='noopener noreferrer'>
							{__('Open in new tab')}
							{externalIcon}
						</a>
						<button className='modalClose' onClick={() => setOpenIndex(null)} aria-label={__('Close demo')}>
							{closeIcon}
						</button>
					</div>
				</header>

				<div className='modalStage'>
					{openIndex > 0 && <button className='modalNav modalNavPrev' onClick={() => setOpenIndex(openIndex - 1)} aria-label={__('Previous demo')}>
						{chevronLeftIcon}
					</button>}

					{iframeLoading && <div className='iframeLoader'>
						<div className='spinner' />
						<span>{__('Loading demo…')}</span>
					</div>}

					{active.type === 'iframe'
						? <iframe
							src={active.url}
							title={sprintf(
								/* translators: %s: Demo title. */
								__('%s demo'),
								active.title
							)}
							sandbox='allow-scripts allow-same-origin allow-popups allow-forms'
							onLoad={() => setIframeLoading(false)}
						/>
						: <div className='imgScroll'>
							<img src={active.url} alt={active.title} onLoad={() => setIframeLoading(false)} />
						</div>
					}

					{openIndex < filtered.length - 1 && <button className='modalNav modalNavNext' onClick={() => setOpenIndex(openIndex + 1)} aria-label={__('Next demo')}>
						{chevronRightIcon}
					</button>}
				</div>
			</div>
		</div>}
	</div>;
};
export default Demos;