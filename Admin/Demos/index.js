import { __, sprintf } from '@wordpress/i18n';
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

/**
 * Live-demo browser — category filter chips, search, and iframe/image preview modal.
 *
 * @param {object} props
 * @param {string} props.name		- Plugin name shown in the page heading
 * @param {object} props.demoInfo	- {allInOneLabel?, allInOneLink?, demos: DemoItem[]}
 *	DemoItem (flat): {icon?, title, type: 'iframe'|'image', url, category?}
 *	DemoItem (grouped): {icon?, title, children: FlatDemoItem[]}
 */
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
			<h1>{sprintf(__('See the %s in action'), name)}</h1>
			<p>{__('Browse ready-made demos - click any card to open a live, interactive preview.')}</p>
		</header>

		<div className='toolbar'>
			<div className='search'>
				{searchIcon}
				<input
					type='text'
					value={search}
					placeholder='Search demos…'
					onChange={e => setSearch(e.target.value)}
				/>
				{search && <button className='searchClear' onClick={() => setSearch('')} aria-label='Clear search'>×</button>}
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
					{cat}
				</button>)}
			</div>
		</div>

		<p className='count'>
			<strong>{filtered.length}</strong> {filtered.length === 1 ? 'demo' : 'demos'}
			{activeCategory !== 'All' && ` in ${activeCategory}`}
			{search.trim() && ` matching "${search}"`}
		</p>

		{filtered.length === 0
			? <div className='empty'>
				{searchIcon}
				<h3>No demos found</h3>
				<p>Try a different search or category.</p>
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
						Preview
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
						<span className='modalProgress'>{openIndex + 1} of {filtered.length}</span>
					</div>

					<div className='modalActions'>
						<a className='modalOpen' href={active.url} target='_blank' rel='noopener noreferrer'>
							Open in new tab
							{externalIcon}
						</a>
						<button className='modalClose' onClick={() => setOpenIndex(null)} aria-label='Close demo'>
							{closeIcon}
						</button>
					</div>
				</header>

				<div className='modalStage'>
					{openIndex > 0 && <button className='modalNav modalNavPrev' onClick={() => setOpenIndex(openIndex - 1)} aria-label='Previous demo'>
						{chevronLeftIcon}
					</button>}

					{iframeLoading && <div className='iframeLoader'>
						<div className='spinner' />
						<span>Loading demo…</span>
					</div>}

					{active.type === 'iframe'
						? <iframe
							src={active.url}
							title={`${active.title} demo`}
							sandbox='allow-scripts allow-same-origin allow-popups allow-forms'
							onLoad={() => setIframeLoading(false)}
						/>
						: <div className='imgScroll'>
							<img src={active.url} alt={active.title} onLoad={() => setIframeLoading(false)} />
						</div>
					}

					{openIndex < filtered.length - 1 && <button className='modalNav modalNavNext' onClick={() => setOpenIndex(openIndex + 1)} aria-label='Next demo'>
						{chevronRightIcon}
					</button>}
				</div>
			</div>
		</div>}
	</div>;
};
export default Demos;