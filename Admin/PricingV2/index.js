import { useEffect, useState } from 'react';
import Button from '../../../../bpl-tools/Components/Button/Button';
import { getFeatures } from '../../../../bpl-tools/Admin/Pricing';
import '../../../../bpl-tools/Admin/lib/fs';

const cycleMeta = {
    monthly: { label: 'Monthly', suffix: '/mo' },
    annual: { label: 'Yearly', suffix: '/yr' },
    lifetime: { label: 'Lifetime', suffix: '' }
};

const trustBadges = [
    {
        title: '14 days money back',
        body: 'Risk-free purchase',
        icon: <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'><path d='M12 2L4 6v6c0 5 3.5 9.6 8 10 4.5-.4 8-5 8-10V6l-8-4z' /><polyline points='9 12 11 14 15 10' /></svg>
    },
    {
        title: 'Lifetime updates',
        body: 'On every plan',
        icon: <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'><polyline points='23 4 23 10 17 10' /><polyline points='1 20 1 14 7 14' /><path d='M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15' /></svg>
    },
    {
        title: 'Priority support',
        body: 'Get help when you need it',
        icon: <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'><path d='M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z' /></svg>
    },
    {
        title: 'Secure checkout',
        body: 'Powered by Freemius',
        icon: <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='11' width='18' height='11' rx='2' /><path d='M7 11V7a5 5 0 0110 0v4' /></svg>
    }
];

const faqs = [
    {
        q: 'Can I upgrade my plan later?',
        a: 'Yes — you can upgrade any time from your account. We prorate the difference automatically.'
    },
    {
        q: 'What happens after my license expires?',
        a: 'The plugin keeps working forever. You only lose access to updates and premium support unless you renew.'
    },
    {
        q: 'Do you offer refunds?',
        a: 'Absolutely. Every plan is backed by a 14 days no-questions-asked money-back guarantee.'
    }
];

const formatPrice = (amount) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '—';
    return Number.isInteger(num) ? String(num) : num.toFixed(2);
};

const PricingV2 = ({ pricingInfo, options }) => {
    const { pluginId, planId, licenses, button, featured, logo } = pricingInfo;

    const [product, setProduct] = useState({});
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [cycles, setCycles] = useState([]);
    const [cycle, setCycle] = useState('');
    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        if (!pluginId) return;
        let mounted = true;
        setIsProductLoading(true);
        fetch(`https://api.bplugins.com/wp-json/bpl/v1/products/${pluginId}`)
            .then((r) => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
            .then((data) => { if (mounted) setProduct(data); })
            .catch(() => { if (mounted) setProduct({}); })
            .finally(() => { if (mounted) setIsProductLoading(false); });
        return () => { mounted = false; };
    }, [pluginId]);

    useEffect(() => {
        if (!product?.id || !planId) return;
        const { plans } = product;
        const plan = plans?.find((p) => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
        const singlePrices = plan?.pricing?.[0];

        if (singlePrices && typeof singlePrices === 'object') {
            const c = [];
            if (singlePrices.monthly !== undefined) c.push({ name: 'monthly', label: 'Monthly' });
            if (singlePrices.annual !== undefined) c.push({ name: 'annual', label: 'Yearly', isDefault: true });
            if (singlePrices.lifetime !== undefined) c.push({ name: 'lifetime', label: 'Lifetime' });
            setCycles(c);
            setCycle(c.find((cc) => cc.isDefault)?.name || c[0]?.name || '');
        } else {
            setCycles([]);
            setCycle('');
        }
    }, [product, planId]);

    if (isProductLoading) {
        return <div className='bp3dPricingV3 bp3dPricingV3Loading'>
            <div className='bp3dPricingV3LoadingSpinner' />
            <p>Loading the latest pricing…</p>
        </div>;
    }

    if (!product?.id) return null;

    const { plans } = product;
    const plan = plans?.find((p) => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
    const pricing = plan?.pricing || [];
    const visiblePricing = pricing.filter((p) => licenses.includes(p?.licenses ?? null));

    const samplePrice = visiblePricing[0];
    let annualSavingsPct = 0;
    if (samplePrice?.monthly && samplePrice?.annual) {
        const fullYear = parseFloat(samplePrice.monthly) * 12;
        const annual = parseFloat(samplePrice.annual);
        if (fullYear > 0) annualSavingsPct = Math.round(((fullYear - annual) / fullYear) * 100);
    }

    return <div className='bp3dPricingV3'>
        <header className='bp3dPricingV3Hero'>
            <span className='bp3dPricingV3Eyebrow'>Pricing</span>
            <h1>Pick the plan that fits your project</h1>
            <p>Every plan unlocks all premium features — choose the license count that matches your sites. Upgrade or downgrade any time.</p>
        </header>

        {cycles.length > 1 && <div className='bp3dPricingV3CycleWrap'>
            <div className='bp3dPricingV3Cycle' role='tablist'>
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
                        {c.name === 'annual' && annualSavingsPct > 0 && <span className='bp3dPricingV3Save'>Save {annualSavingsPct}%</span>}
                    </button>
                ))}
            </div>
        </div>}

        <div className='bp3dPricingV3Plans'>
            {visiblePricing.length ? visiblePricing.map((price, index) => {
                const licensesCount = price?.licenses;
                const isFeatured = featured?.selected === (licensesCount || 'null');
                const planFeatures = getFeatures(plans, planId);
                const amount = price?.[cycle];
                const cycleInfo = cycleMeta[cycle] || { label: '', suffix: '' };
                const monthlyEquivalent = cycle === 'annual' && price?.annual ? (parseFloat(price.annual) / 12) : null;
                const planLabel = !licensesCount
                    ? 'Unlimited Sites'
                    : (licensesCount === 1 ? 'Single Site' : `${licensesCount} Sites`);
                const planTagline = !licensesCount
                    ? 'For agencies & enterprise builds'
                    : (licensesCount === 1 ? 'Perfect for personal projects' : 'Great for freelancers');

                return <div key={index} className={`bp3dPricingV3Plan ${isFeatured ? 'isFeatured' : ''}`}>
                    {isFeatured && <div className='bp3dPricingV3Badge'>{featured?.text || 'Most Popular'}</div>}

                    <div className='bp3dPricingV3PlanHead'>
                        <h3>{planLabel}</h3>
                        <p>{planTagline}</p>
                    </div>

                    <div className='bp3dPricingV3PriceWrap'>
                        <div className='bp3dPricingV3Price'>
                            <span className='bp3dPricingV3Currency'>$</span>
                            <span className='bp3dPricingV3Amount'>{formatPrice(amount)}</span>
                            {cycleInfo.suffix && <span className='bp3dPricingV3Suffix'>{cycleInfo.suffix}</span>}
                        </div>

                        {monthlyEquivalent !== null && <p className='bp3dPricingV3Equiv'>
                            ≈ ${formatPrice(monthlyEquivalent)}/month, billed yearly
                        </p>}

                        {cycle === 'lifetime' && <p className='bp3dPricingV3Equiv'>One-time payment, pay once forever.</p>}
                        {cycle === 'monthly' && <p className='bp3dPricingV3Equiv'>Billed monthly, cancel anytime.</p>}
                    </div>

                    <ul className='bp3dPricingV3Features'>
                        {planFeatures.map((f, i) => (
                            <li key={i}>
                                <svg viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
                                    <polyline points='20 6 9 17 4 12' />
                                </svg>
                                <span dangerouslySetInnerHTML={{ __html: f }} />
                            </li>
                        ))}
                    </ul>

                    <Button
                        className='bp3dPricingV3Cta'
                        onClick={(e) => {
                            e.preventDefault();
                            new FS.Checkout({
                                plugin_id: product.id,
                                plan_id: planId,
                                public_key: product.public_key
                            }).open({
                                image: logo || product.icon,
                                title: product.title,
                                licenses: licensesCount,
                                billing_cycle: cycle,
                                ...options
                            });
                        }}
                    >
                        {button.label}
                    </Button>
                </div>;
            }) : <p className='bp3dPricingV3Empty'>No plans available right now.</p>}
        </div>

        <section className='bp3dPricingV3Trust'>
            {trustBadges.map((b, i) => (
                <div key={i} className='bp3dPricingV3TrustItem'>
                    <span className='bp3dPricingV3TrustIcon'>{b.icon}</span>
                    <div>
                        <strong>{b.title}</strong>
                        <span>{b.body}</span>
                    </div>
                </div>
            ))}
        </section>

        <section className='bp3dPricingV3Faq'>
            <h2>Frequently asked questions</h2>

            <div className='bp3dPricingV3FaqList'>
                {faqs.map((f, i) => (
                    <div key={i} className={`bp3dPricingV3FaqItem ${openFaq === i ? 'isOpen' : ''}`}>
                        <button
                            type='button'
                            className='bp3dPricingV3FaqQ'
                            aria-expanded={openFaq === i}
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                            <span>{f.q}</span>
                            <svg viewBox='0 0 24 24' width={18} height={18} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                                <polyline points='6 9 12 15 18 9' />
                            </svg>
                        </button>
                        {openFaq === i && <div className='bp3dPricingV3FaqA'>{f.a}</div>}
                    </div>
                ))}
            </div>
        </section>
    </div>;
};

export default PricingV2;
