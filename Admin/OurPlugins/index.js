import { useEffect, useMemo, useState } from 'react';
import { withSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import Button from '../../../../bpl-tools/Components/Button/Button';

const DEFAULT_SLUGS = [
    '3d-viewer',
    'html5-video-player',
    'html5-audio-player',
    'pdf-poster',
    'document-emberdder',
    'advanced-post-block',
    'advance-custom-html',
    'b-carousel-block',
    'b-blocks',
    'embed-lottie-player',
    'b-slider'
];

const formatCount = (num) => {
    if (num === undefined || num === null) return '0';
    const abs = Math.abs(num);
    if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(num);
};

const getDisplayName = (name) => {
    if (!name) return '';
    const decoded = name
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&mdash;/g, '—')
        .replace(/&#45;/g, '-');
    return decoded.split(/\s*[–\-—]\s*/)[0].trim();
};

const stripTags = (s) => (s || '').replace(/<[^>]+>/g, '');

const StarRow = ({ rating = 0 }) => {
    const stars = Math.round(rating / 20);
    return <span className='bp3dOurPlugV3Stars' aria-label={`${(rating / 20).toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} viewBox='0 0 24 24' width={13} height={13} fill={i <= stars ? '#fbbf24' : '#e5e7eb'}>
                <path d='M12 2l2.39 6.95L22 9.27l-5.45 4.73L18.18 22 12 17.77 5.82 22l1.63-7.99L2 9.27l7.61-.32L12 2z' />
            </svg>
        ))}
    </span>;
};

const PluginCard = ({ plugin, path, initStatus }) => {
    const { name, slug, icons, short_description, version } = plugin;
    const [status, setStatus] = useState(initStatus);

    const handleInstall = async () => {
        setStatus(status === 'installed' ? 'activating' : 'installing');
        try {
            if (status === 'installed' && path) {
                await apiFetch({
                    path: `/wp/v2/plugins/${path}`,
                    method: 'POST',
                    data: { status: 'active' }
                });
                setStatus('success');
                setTimeout(() => setStatus('activated'), 1000);
                return;
            }
            await apiFetch({
                path: '/wp/v2/plugins',
                method: 'POST',
                data: { slug, status: 'active' }
            });
            setStatus('success');
            setTimeout(() => setStatus('activated'), 1000);
        } catch (e) {
            setStatus('error');
            setTimeout(() => setStatus(status === 'installed' ? 'installed' : 'notfound'), 1400);
        }
    };

    const label = (() => {
        switch (status) {
            case 'activated':
            case 'success':
                return 'Activated';
            case 'installed':
                return 'Activate';
            case 'activating':
                return 'Activating…';
            case 'installing':
                return 'Installing…';
            case 'error':
                return 'Failed';
            default:
                return 'Install & Activate';
        }
    })();

    const isDone = status === 'activated' || status === 'success';
    const isBusy = status === 'installing' || status === 'activating';

    return <article className='bp3dOurPlugV3Card'>
        <div className='bp3dOurPlugV3CardTop'>
            <img className='bp3dOurPlugV3Icon' src={icons?.['1x'] || icons?.['2x'] || ''} alt={name} />

            <div className='bp3dOurPlugV3CardId'>
                <h3 dangerouslySetInnerHTML={{ __html: getDisplayName(name) }} />
                {version && <span className='bp3dOurPlugV3Ver'>v{version}</span>}
            </div>

            {isDone && <span className='bp3dOurPlugV3Active' title='Active on this site'>
                <svg viewBox='0 0 24 24' width={12} height={12} fill='none' stroke='currentColor' strokeWidth={3} strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='20 6 9 17 4 12' />
                </svg>
                Active
            </span>}
        </div>

        <p className='bp3dOurPlugV3Desc' dangerouslySetInnerHTML={{ __html: stripTags(short_description) }} />

        <div className='bp3dOurPlugV3Stats'>
            <span className='bp3dOurPlugV3Stat'>
                <svg viewBox='0 0 24 24' width={14} height={14} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                    <polyline points='7 10 12 15 17 10' />
                    <line x1='12' y1='15' x2='12' y2='3' />
                </svg>
                {formatCount(plugin.downloaded)}
            </span>

            <span className='bp3dOurPlugV3Stat'>
                <StarRow rating={plugin.rating} />
                <strong>{((plugin.rating || 0) / 20).toFixed(1)}</strong>
            </span>
        </div>

        <Button
            className={`bp3dOurPlugV3Cta status-${status}`}
            disabled={isDone || isBusy}
            onClick={handleInstall}
        >
            {isBusy && <span className='bp3dOurPlugV3CtaSpinner' />}
            {label}
        </Button>
    </article>;
};

const OurPlugins = ({ slug, slugs: allSlugs = DEFAULT_SLUGS, installedPlugins }) => {
    const [plugins, setPlugins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('popular');

    const slugs = useMemo(() => (allSlugs || []).filter((s) => s !== slug), [allSlugs, slug]);

    useEffect(() => {
        if (!slugs.length) return;
        let cancelled = false;
        setIsLoading(true);
        fetch('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[author]=bplugins&request[per_page]=100&request[fields]=title,name,slug,icons,short_description,version,active_installs,rating,ratings,downloaded', {
            credentials: 'omit',
            mode: 'cors'
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                setPlugins((data?.plugins || []).filter((p) => slugs.includes(p.slug)));
            })
            .catch(() => { if (!cancelled) setPlugins([]); })
            .finally(() => { if (!cancelled) setIsLoading(false); });
        return () => { cancelled = true; };
    }, [JSON.stringify(slugs)]);

    const filteredSorted = useMemo(() => {
        const q = search.trim().toLowerCase();
        let list = plugins.filter((p) => !q || p.name.toLowerCase().includes(q) || (p.short_description || '').toLowerCase().includes(q));
        if (sort === 'popular') list.sort((a, b) => (b.active_installs || 0) - (a.active_installs || 0));
        if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        if (sort === 'name') list.sort((a, b) => getDisplayName(a.name).localeCompare(getDisplayName(b.name)));
        return list;
    }, [plugins, search, sort]);

    if (isLoading) {
        return <div className='bp3dOurPlugV3 bp3dOurPlugV3Loading'>
            <div className='bp3dOurPlugV3Spinner' />
            <p>Fetching plugins from the WordPress directory…</p>
        </div>;
    }

    return <div className='bp3dOurPlugV3'>
        <header className='bp3dOurPlugV3Hero'>
            <span className='bp3dOurPlugV3Eyebrow'>Made by bPlugins</span>
            <h1>Discover more plugins from our team</h1>
            <p>Hand-crafted WordPress plugins built with the same care as Advanced Post Block. Install any of them with a single click.</p>
        </header>

        <div className='bp3dOurPlugV3Toolbar'>
            <div className='bp3dOurPlugV3Search'>
                <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='11' cy='11' r='7' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                </svg>
                <input
                    type='text'
                    placeholder='Search plugins…'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && <button onClick={() => setSearch('')} aria-label='Clear search'>×</button>}
            </div>

            <div className='bp3dOurPlugV3SortLabel'>Sort by</div>

            <div className='bp3dOurPlugV3Sort' role='tablist'>
                {[
                    { key: 'popular', label: 'Popular' },
                    { key: 'rating', label: 'Top Rated' },
                    { key: 'name', label: 'A–Z' }
                ].map((opt) => (
                    <button
                        key={opt.key}
                        type='button'
                        role='tab'
                        aria-selected={sort === opt.key}
                        className={sort === opt.key ? 'isActive' : ''}
                        onClick={() => setSort(opt.key)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>

        <p className='bp3dOurPlugV3Count'>
            <strong>{filteredSorted.length}</strong> {filteredSorted.length === 1 ? 'plugin' : 'plugins'}
            {search && ` matching "${search}"`}
        </p>

        {filteredSorted.length === 0 ? <div className='bp3dOurPlugV3Empty'>
            <svg viewBox='0 0 24 24' width={36} height={36} fill='none' stroke='currentColor' strokeWidth={1.6} strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='11' cy='11' r='7' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
            </svg>
            <h3>No plugins match</h3>
            <p>Try a different keyword.</p>
        </div> : <div className='bp3dOurPlugV3Grid'>
            {filteredSorted.map((plugin) => {
                const installed = installedPlugins?.find((i) => i?.plugin?.includes(plugin.slug)) ?? null;
                const activated = installed ? installed.status === 'active' : false;
                const initStatus = activated ? 'activated' : (installed ? 'installed' : 'notfound');
                return <PluginCard key={plugin.slug} plugin={plugin} path={installed?.plugin} initStatus={initStatus} />;
            })}
        </div>}
    </div>;
};

export default withSelect((select) => {
    const { getPlugins } = select('core');
    return {
        installedPlugins: getPlugins?.({ per_page: -1 })
    };
})(OurPlugins);
