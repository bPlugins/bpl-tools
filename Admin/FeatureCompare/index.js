import { useEffect, useState } from 'react';
import '../../../../bpl-tools/Admin/lib/fs';
import Button from '../../../../bpl-tools/Components/Button/Button';

const cycleLabels = { monthly: 'Monthly', annual: 'Yearly', lifetime: 'Lifetime' };
const cycleShort = { monthly: '/mo', annual: '/yr', lifetime: 'one-time' };

const CheckIcon = () => <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
    <polyline points='20 6 9 17 4 12' />
</svg>;

const CrossIcon = () => <svg viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2.2} strokeLinecap='round' strokeLinejoin='round'>
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
</svg>;

const FeatureCompare = ({ plans: planNames = ['free', 'pro'], freemius }) => {
    const { product_id, public_key } = freemius || {};

    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [cycles, setCycles] = useState([]);
    const [cycle, setCycle] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!product_id) return;
        let mounted = true;
        setIsLoading(true);
        fetch(`https://api.bplugins.com/wp-json/bpl/v1/products/${product_id}`)
            .then((r) => r.ok ? r.json() : Promise.reject(`${r.status}`))
            .then((data) => { if (mounted) setProduct(data); })
            .catch(() => { if (mounted) setProduct({}); })
            .finally(() => { if (mounted) setIsLoading(false); });
        return () => { mounted = false; };
    }, [product_id]);

    useEffect(() => {
        if (!product?.id) return;
        const visible = product?.plans?.filter((p) => planNames.includes(p.name)) || [];
        const proPlan = visible.find((p) => p.name !== 'free') || visible[0] || {};
        const singlePrices = proPlan?.pricing?.[0];
        if (singlePrices && typeof singlePrices === 'object') {
            const c = [];
            if (singlePrices.monthly !== undefined) c.push({ name: 'monthly', label: 'Monthly', short: '/mo' });
            if (singlePrices.annual !== undefined) c.push({ name: 'annual', label: 'Yearly', short: '/yr', isDefault: true });
            if (singlePrices.lifetime !== undefined) c.push({ name: 'lifetime', label: 'Lifetime', short: 'one-time' });
            setCycles(c);
            setCycle(c.find((cc) => cc.isDefault)?.name || c[0]?.name || '');
        }
    }, [product]);

    if (isLoading) {
        return <div className='bp3dCompareV3Loading'>
            <div className='bp3dCompareV3Spinner' />
            <p>Loading feature comparison…</p>
        </div>;
    }

    if (!product?.id) return null;

    const visiblePlans = product?.plans?.filter((p) => planNames.includes(p.name)) || [];

    const baseFeatures = visiblePlans[visiblePlans.length - 1]?.features || [];
    const features = baseFeatures.map((bf) => {
        const presentIn = visiblePlans
            .filter((p) => p.features.some((f) => f.title === bf.title))
            .map((p) => p.id);
        return { ...bf, plans: presentIn };
    });
    visiblePlans.forEach((p) => {
        p.features.forEach((f) => {
            if (!features.some((x) => x.title === f.title)) {
                features.push({ ...f, plans: [p.id] });
            }
        });
    });

    // Surface "Free + Pro" rows (all-green) before Pro-only rows so users see
    // what's already included before scrolling into the upgrade incentives.
    const freePlanLocal = visiblePlans.find((p) => p.name === 'free');
    features.sort((a, b) => {
        const aInFree = freePlanLocal ? a.plans?.includes(freePlanLocal.id) : false;
        const bInFree = freePlanLocal ? b.plans?.includes(freePlanLocal.id) : false;
        if (aInFree === bInFree) return 0;
        return aInFree ? -1 : 1;
    });

    let annualSavingsPct = 0;
    const proPlan = visiblePlans.find((p) => p.name !== 'free');
    const samplePricing = proPlan?.pricing?.find((p) => parseInt(p.licenses) === 1);
    if (samplePricing?.monthly && samplePricing?.annual) {
        const full = parseFloat(samplePricing.monthly) * 12;
        const annual = parseFloat(samplePricing.annual);
        if (full > 0) annualSavingsPct = Math.round(((full - annual) / full) * 100);
    }

    const proOnlyCount = features.filter((f) => f.plans.length === 1 && proPlan && f.plans[0] === proPlan.id).length;

    const q = query.trim().toLowerCase();
    const filteredFeatures = q ? features.filter((f) => f.title.replace(/<[^>]+>/g, '').toLowerCase().includes(q)) : features;

    return <div className='bp3dCompareV3'>
        <header className='bp3dCompareV3Hero'>
            <span className='bp3dCompareV3Eyebrow'>Compare</span>
            <h1>Free vs Pro at a glance</h1>
            <p>See exactly what unlocks when you upgrade. <strong>{proOnlyCount}</strong> {proOnlyCount === 1 ? 'feature is' : 'features are'} exclusive to Pro.</p>
        </header>

        {cycles.length > 1 && <div className='bp3dCompareV3CycleWrap'>
            <div className='bp3dCompareV3Cycle' role='tablist'>
                {cycles.map((c) => (
                    <button
                        key={c.name}
                        type='button'
                        role='tab'
                        aria-selected={c.name === cycle}
                        className={c.name === cycle ? 'isActive' : ''}
                        onClick={() => setCycle(c.name)}
                    >
                        {c.label}
                        {c.name === 'annual' && annualSavingsPct > 0 && <span className='bp3dCompareV3Save'>Save {annualSavingsPct}%</span>}
                    </button>
                ))}
            </div>
        </div>}

        <div className='bp3dCompareV3Plans'>
            {visiblePlans.map((plan) => {
                const isFree = plan.name === 'free';
                const price = Array.isArray(plan.pricing) ? plan.pricing.find((p) => parseInt(p.licenses) === 1)?.[cycle] : '0';
                const cycleText = cycleLabels[cycle] || '';
                const suffix = cycleShort[cycle] || '';

                return <div key={plan.id} className={`bp3dCompareV3Plan ${isFree ? 'isFree' : 'isPro'}`}>
                    <div className='bp3dCompareV3PlanHead'>
                        <div className='bp3dCompareV3PlanTag'>
                            {isFree ? 'Free' : 'Pro'}
                        </div>
                        <h3>{plan.title}</h3>
                        <p>{isFree ? 'Free forever — all the essentials to get started.' : 'Everything in Free, plus advanced features and priority support.'}</p>
                    </div>

                    <div className='bp3dCompareV3PlanPrice'>
                        <span className='bp3dCompareV3Curr'>$</span>
                        <span className='bp3dCompareV3Amt'>{isFree ? '0' : (price || '—')}</span>
                        <span className='bp3dCompareV3Cyc'>{isFree ? 'forever' : (suffix === 'one-time' ? 'one-time' : `${suffix} • billed ${cycleText.toLowerCase()}`)}</span>
                    </div>

                    {isFree ? (
                        <div className='bp3dCompareV3PlanCta bp3dCompareV3PlanCtaHave' aria-disabled='true'>
                            <svg viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2.6} strokeLinecap='round' strokeLinejoin='round'>
                                <polyline points='20 6 9 17 4 12' />
                            </svg>
                            You Already Have It
                        </div>
                    ) : (
                        <Button
                            className='bp3dCompareV3PlanCta'
                            onClick={(e) => {
                                e.preventDefault();
                                new FS.Checkout({
                                    plugin_id: product_id,
                                    plan_id: plan.id,
                                    public_key
                                }).open({
                                    licenses: 1,
                                    billing_cycle: cycle
                                });
                            }}
                        >
                            Get Pro →
                        </Button>
                    )}
                </div>;
            })}
        </div>

        <div className='bp3dCompareV3TableWrap'>
            <div className='bp3dCompareV3TableHead'>
                <h2>Feature breakdown</h2>

                <div className='bp3dCompareV3SearchBox'>
                    <svg viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                        <circle cx='11' cy='11' r='7' />
                        <line x1='21' y1='21' x2='16.65' y2='16.65' />
                    </svg>
                    <input
                        type='text'
                        placeholder='Filter features…'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && <button onClick={() => setQuery('')} aria-label='Clear filter'>×</button>}
                </div>
            </div>

            <div className='bp3dCompareV3TableScroll'>
                <table className='bp3dCompareV3Table'>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            {visiblePlans.map((p) => (
                                <th key={p.id} className={p.name === 'free' ? 'isFreeCol' : 'isProCol'}>
                                    {p.name === 'free' ? 'Free' : 'Pro'}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFeatures.length === 0 ? <tr>
                            <td colSpan={visiblePlans.length + 1} className='bp3dCompareV3Empty'>
                                No features match your search.
                            </td>
                        </tr> : filteredFeatures.map((feature, i) => {
                            const isProOnly = proPlan && feature.plans.length === 1 && feature.plans[0] === proPlan.id;

                            return <tr key={i} className={isProOnly ? 'isProOnly' : ''}>
                                <td>
                                    <span dangerouslySetInnerHTML={{ __html: feature.title }} />
                                    {isProOnly && <span className='bp3dCompareV3RowTag'>Pro only</span>}
                                </td>
                                {visiblePlans.map((plan) => {
                                    const has = feature.plans?.includes(plan.id);
                                    return <td key={plan.id} className={plan.name === 'free' ? 'isFreeCol' : 'isProCol'}>
                                        <span className={`bp3dCompareV3Cell ${has ? 'isCheck' : 'isCross'}`} aria-label={has ? 'Included' : 'Not included'}>
                                            {has ? <CheckIcon /> : <CrossIcon />}
                                        </span>
                                    </td>;
                                })}
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {proPlan && <section className='bp3dCompareV3CtaBanner'>
            <div>
                <h2>Ready to unlock everything?</h2>
                <p>Upgrade to Pro and get every feature, future updates, and priority support — backed by a 14 days money-back guarantee.</p>
            </div>

            <Button
                className='bp3dCompareV3PlanCta'
                onClick={(e) => {
                    e.preventDefault();
                    new FS.Checkout({
                        plugin_id: product_id,
                        plan_id: proPlan.id,
                        public_key
                    }).open({
                        licenses: 1,
                        billing_cycle: cycle
                    });
                }}
            >
                Get Pro now →
            </Button>
        </section>}
    </div>;
};

export default FeatureCompare;
