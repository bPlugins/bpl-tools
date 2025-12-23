import { useEffect, useState } from 'react';

import Button from '../../Components/Button/Button';
import '../lib/fs';
import './style.scss';

export const getFeatures = (plans, planId) => {
    const freeFeatures = plans.find(p => p.name === 'free')?.features?.map(f => f.title);
    const proFeatures = plans.find(p => p.name === 'pro')?.features?.filter(f => !freeFeatures.includes(f.title)).map(f => f.title);

    const features = {
        'free': freeFeatures,
        'pro': proFeatures
    }

    const planName = plans.find(p => parseInt(p.id) === parseInt(planId))?.name;
    const planFeatures = features[planName] || plans.find(p => parseInt(p.id) === parseInt(planId))?.features?.map(f => f.title);

    return planFeatures || [];
}

const DynamicPricing = ({ pricingInfo, options }) => {
    const { pluginId, planId, licenses } = pricingInfo;

    // new state for fetched single product
    const [product, setProduct] = useState({});
    const [isProductLoading, setIsProductLoading] = useState(false);
    useEffect(() => {
        if (pluginId) {
            let mounted = true;
            const url = `https://api.bplugins.com/wp-json/bpl/v1/products/${pluginId}`;
            setIsProductLoading(true);
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (!mounted) return;
                    setProduct(data);
                })
                .catch(err => {
                    if (!mounted) return;
                    // eslint-disable-next-line no-console
                    console.error(err.message || 'Fetch error');
                    setProduct({});
                })
                .finally(() => {
                    if (mounted) setIsProductLoading(false);
                });
            return () => {
                mounted = false;
            };
        }
    }, [pluginId]);


    const [cycles, setCycles] = useState([]);
    const [cycle, setCycle] = useState(cycles?.find(c => c.isDefault)?.name || cycles[0]?.name);

    useEffect(() => {
        if (product?.id && planId) {
            const { plans } = product || {};
            const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};

            const singlePrices = plan?.pricing?.[0];

            if (singlePrices && typeof singlePrices === 'object') {
                let c = []
                // eslint-disable-next-line no-prototype-builtins
                if (singlePrices.hasOwnProperty('monthly')) {
                    c.push({ name: 'monthly', label: 'Monthly' });
                }
                // eslint-disable-next-line no-prototype-builtins
                if (singlePrices.hasOwnProperty('annual')) {
                    c.push({ name: 'annual', label: 'Yearly', isDefault: true });
                }
                // eslint-disable-next-line no-prototype-builtins
                if (singlePrices.hasOwnProperty('lifetime')) {
                    c.push({ name: 'lifetime', label: 'Lifetime' });
                }
                setCycles(c);
                setCycle(c?.find(cc => cc.isDefault)?.name || c[0]?.name)
            } else {
                setCycles([]);
                setCycle('');
            }
        }
    }, [product, isProductLoading, planId]);

    if (isProductLoading) {
        return <div className='bPlDashboardPricing bPlDashboardBox'>
            <h2>Loading...</h2>
        </div>;
    }

    if (!product || !product?.id) {
        return null;
    }

    const { plans } = product || {};
    const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
    const { pricing = [] } = plan || {};

    const calculateMaxAnnualDiscount = () => {
        const discounts = pricing.map(plan => {
            const monthlyForYear = parseFloat(plan.monthly) * 12;
            const annualPrice = parseFloat(plan.annual);
            return ((monthlyForYear - annualPrice) / monthlyForYear) * 100;
        });
        return Math.max(...discounts).toFixed(0);
    };

    return <div className='bPlDashboardPricing bPlDashboardBox'>
        {cycles?.length > 1 && <div className='cycles'>
            {cycles.map(c => {
                return <button key={c.name} className={c.name === cycle ? 'active' : ''} onClick={() => setCycle(c.name)}>
                    {c.label} {'annual' === c.name && <span>{`upto ${calculateMaxAnnualDiscount()}% off`}</span>}
                </button>;
            })}
        </div>}

        {cycles?.length === 1 && cycles[0]?.name === 'lifetime' && <h2 className='pricingTitle'>One-time payment, lifetime access</h2>}

        <div className='plans'>
            {pricing?.length ?
                pricing?.map((price, index) => licenses.includes(price?.licenses) && <Plan key={index} {...{ pricingInfo, product, price, cycle, options }} />) :

                <h3 style={{ gridColumn: `1 / -1`, textAlign: 'center' }}>Select a plan</h3>
            }
        </div>
    </div>
};
export default DynamicPricing;

const Plan = ({ pricingInfo, product, price, cycle, options }) => {
    const { logo, planId, button, featured } = pricingInfo;
    const { title, id, public_key, icon } = product || {};
    const { licenses } = price || {};

    const amount = price?.[cycle] + '';

    const [solidPrice, cents] = amount?.split('.') || [];

    const name = !licenses ? 'Unlimited Sites' : (licenses === 1 ? 'Single Site' : `${licenses} Sites`);
    const isFeatured = featured?.selected === (licenses || 'null');

    return <div className={`plan ${isFeatured ? 'bestValue' : ''}`} data-best-text={featured?.text}>
        <h3 className='planName wp-block-heading'>{name}</h3>

        <div className='priceWrap'>
            <p className='price'>${solidPrice}{cents && <small>.{cents}</small>}</p>
        </div>

        <Button className={`outline ${isFeatured ? 'white' : ''}`} onClick={e => {
            e.preventDefault();

            // eslint-disable-next-line no-undef
            new FS.Checkout({
                plugin_id: id,
                plan_id: planId,
                public_key
            }).open({
                image: logo || icon,
                title,
                licenses,
                billing_cycle: cycle,
                ...options
            });
        }}>{button.label}</Button>

        <ul className={`wp-block-list features checkList ${isFeatured ? 'whiteCheck' : 'themeCheck'}`}>
            {getFeatures(product.plans, planId).map((f, i) => <li key={i}>{f}</li>)}
        </ul>
    </div>
}