import { useEffect, useMemo, useState } from 'react';

const flatten = (demos) => {
    const out = [];
    demos.forEach((d) => {
        if (d.children && d.children.length) {
            d.children.forEach((c) => out.push(c));
        } else if (d.url && d.url !== '#') {
            out.push(d);
        }
    });
    return out;
};

const categorize = (title) => {
    if (/grid/i.test(title)) return 'Grid';
    if (/masonry/i.test(title)) return 'Masonry';
    if (/slider/i.test(title)) return 'Slider';
    if (/ticker/i.test(title)) return 'Ticker';
    if (/section|design/i.test(title)) return 'Sections';
    return 'All Posts';
};

const categoryAccent = {
    Grid: '#146ef5',
    Masonry: '#a855f7',
    Slider: '#0ea5e9',
    Ticker: '#22c55e',
    Sections: '#ff7a00',
    'All Posts': '#64748b'
};

const Demos = ({ demoInfo }) => {
    const items = useMemo(() => flatten(demoInfo.demos || []), [demoInfo]);

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState(null);
    const [iframeLoading, setIframeLoading] = useState(false);

    const categories = useMemo(() => {
        const set = new Set();
        items.forEach((i) => set.add(categorize(i.title)));
        return ['All', ...Array.from(set)];
    }, [items]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((i) => {
            const cat = categorize(i.title);
            if (activeCategory !== 'All' && cat !== activeCategory) return false;
            if (q && !i.title.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [items, search, activeCategory]);

    const active = openIndex !== null ? filtered[openIndex] : null;

    useEffect(() => {
        if (active) setIframeLoading(true);
    }, [active?.url]);

    useEffect(() => {
        if (openIndex === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpenIndex(null);
            if (e.key === 'ArrowRight') setOpenIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i));
            if (e.key === 'ArrowLeft') setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i));
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [openIndex, filtered.length]);

    return <div className='bp3dDemosV3'>
        <header className='bp3dDemosV3Hero'>
            <span className='bp3dDemosV3Eyebrow'>Live Demos</span>
            <h1>See Advanced Post Block in action</h1>
            <p>Browse ready-made demos to discover what you can build — click any card to open a live, interactive preview.</p>
        </header>

        <div className='bp3dDemosV3Toolbar'>
            <div className='bp3dDemosV3Search'>
                <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='11' cy='11' r='7' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
                <input type='text' value={search} placeholder='Search demos…' onChange={(e) => setSearch(e.target.value)} />
                {search && <button className='bp3dDemosV3SearchClear' onClick={() => setSearch('')} aria-label='Clear search'>×</button>}
            </div>

            <div className='bp3dDemosV3Chips' role='tablist'>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type='button'
                        role='tab'
                        aria-selected={activeCategory === cat}
                        className={`bp3dDemosV3Chip ${activeCategory === cat ? 'isActive' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        <span className='bp3dDemosV3ChipDot' style={{ background: cat === 'All' ? '#94a3b8' : categoryAccent[cat] || '#146ef5' }} />
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <p className='bp3dDemosV3Count'>
            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'demo' : 'demos'}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
        </p>

        {filtered.length === 0 ? <div className='bp3dDemosV3Empty'>
            <svg viewBox='0 0 24 24' width={36} height={36} fill='none' stroke='currentColor' strokeWidth={1.6} strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='7' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
            <h3>No demos found</h3>
            <p>Try a different search or category.</p>
        </div> : <div className='bp3dDemosV3Grid'>
            {filtered.map((demo, index) => {
                const cat = categorize(demo.title);
                const accent = categoryAccent[cat] || '#146ef5';

                return <button
                    key={`${demo.title}-${index}`}
                    type='button'
                    className='bp3dDemosV3Card'
                    onClick={() => setOpenIndex(index)}
                    style={{ '--bp3dDemoAccent': accent }}
                >
                    <div className='bp3dDemosV3CardIcon'>{demo.icon}</div>
                    <span className='bp3dDemosV3CardCat'>{cat}</span>
                    <h3 className='bp3dDemosV3CardTitle'>{demo.title}</h3>
                    <span className='bp3dDemosV3CardAction'>
                        Preview
                        <svg viewBox='0 0 24 24' width={14} height={14} fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
                            <line x1='5' y1='12' x2='19' y2='12' />
                            <polyline points='12 5 19 12 12 19' />
                        </svg>
                    </span>
                </button>;
            })}
        </div>}

        {active && <div className='bp3dDemosV3Modal' role='dialog' aria-modal='true' aria-labelledby='bp3dDemoTitle'>
            <div className='bp3dDemosV3ModalBackdrop' onClick={() => setOpenIndex(null)} />

            <div className='bp3dDemosV3ModalContent'>
                <header className='bp3dDemosV3ModalHead'>
                    <div className='bp3dDemosV3ModalTitleWrap'>
                        <span className='bp3dDemosV3ModalCat' style={{ background: categoryAccent[categorize(active.title)] || '#146ef5' }}>
                            {categorize(active.title)}
                        </span>
                        <h2 id='bp3dDemoTitle'>{active.title}</h2>
                        <span className='bp3dDemosV3ModalProgress'>{(openIndex ?? 0) + 1} of {filtered.length}</span>
                    </div>

                    <div className='bp3dDemosV3ModalActions'>
                        <a className='bp3dDemosV3ModalOpen' href={active.url} target='_blank' rel='noopener noreferrer'>
                            Open in new tab
                            <svg viewBox='0 0 24 24' width={14} height={14} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                                <polyline points='15 3 21 3 21 9' />
                                <line x1='10' y1='14' x2='21' y2='3' />
                            </svg>
                        </a>

                        <button className='bp3dDemosV3ModalClose' onClick={() => setOpenIndex(null)} aria-label='Close demo'>
                            <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                                <line x1='18' y1='6' x2='6' y2='18' />
                                <line x1='6' y1='6' x2='18' y2='18' />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className='bp3dDemosV3ModalStage'>
                    {openIndex !== null && openIndex > 0 && <button className='bp3dDemosV3ModalNav bp3dDemosV3ModalNavPrev' onClick={() => setOpenIndex(openIndex - 1)} aria-label='Previous demo'>
                        <svg viewBox='0 0 24 24' width={20} height={20} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                            <polyline points='15 18 9 12 15 6' />
                        </svg>
                    </button>}

                    {iframeLoading && <div className='bp3dDemosV3IframeLoader'>
                        <div className='bp3dDemosV3Spinner' />
                        <span>Loading demo…</span>
                    </div>}

                    {active.type === 'iframe' ? <iframe
                        src={active.url}
                        title={`${active.title} demo`}
                        sandbox='allow-scripts allow-same-origin allow-popups allow-forms'
                        onLoad={() => setIframeLoading(false)}
                    /> : <div className='bp3dDemosV3ImgScroll'>
                        <img src={active.url} alt={active.title} onLoad={() => setIframeLoading(false)} />
                    </div>}

                    {openIndex !== null && openIndex < filtered.length - 1 && <button className='bp3dDemosV3ModalNav bp3dDemosV3ModalNavNext' onClick={() => setOpenIndex(openIndex + 1)} aria-label='Next demo'>
                        <svg viewBox='0 0 24 24' width={20} height={20} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                            <polyline points='9 18 15 12 9 6' />
                        </svg>
                    </button>}
                </div>
            </div>
        </div>}
    </div>;
};

export default Demos;
