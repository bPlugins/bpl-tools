/**
	* Pricing Component
	*
	* @props pricingInfo (required): pricing configuration {pluginId, planId, licenses, logo, button, featured} (Object)
	* @props options (required): additional Freemius checkout options (Object)
	*/

import { useEffect, useState } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';

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

const Pricing = ({ pricingInfo, options }) => {
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
					c.push({ name: 'monthly', label: __('Billed Monthly') });
				}
				// eslint-disable-next-line no-prototype-builtins
				if (singlePrices.hasOwnProperty('annual')) {
					c.push({ name: 'annual', label: __('Billed Yearly'), isDefault: true });
				}
				// eslint-disable-next-line no-prototype-builtins
				if (singlePrices.hasOwnProperty('lifetime')) {
					c.push({ name: 'lifetime', label: __('Lifetime') });
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
			<h2>{__('Loading...')}</h2>
		</div>;
	}

	if (!product || !product?.id) {
		return null;
	}

	const { plans } = product || {};
	const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
	const { pricing = [] } = plan || {};

	return <div className='bPlDashboardPricing bPlDashboardCard'>
		{cycles?.length > 1 && <div className='cycles'>
			{cycles.map(c => {
				return <button key={c.name} className={c.name === cycle ? 'active' : ''} onClick={() => setCycle(c.name)}>
					{c.label}
				</button>;
			})}
		</div>}

		{cycles?.length === 1 && cycles[0]?.name === 'lifetime' && <h2 className='pricingTitle'>{__('One-time payment, lifetime access')}</h2>}

		<div className='plans'>
			{pricing?.length ?
				pricing?.map((price, index) => licenses.includes(price?.licenses) && <Plan key={index} {...{ pricingInfo, product, price, cycle, options }} />) :

				<h3 style={{ gridColumn: `1 / -1`, textAlign: 'center' }}>{__('Select a plan')}</h3>
			}
		</div>
	</div>
};
export default Pricing;

// Whole sentence per license count and billing cycle, e.g. "3 sites license for 1 year"
const getLicenseNote = (licenses, cycle) => {
	if (!licenses) {
		if ('monthly' === cycle) return __('Unlimited site license for 1 month');
		if ('annual' === cycle) return __('Unlimited site license for 1 year');
		return __('Unlimited site license for lifetime');
	}

	if ('monthly' === cycle) {
		/* translators: %d: Number of sites. */
		return sprintf(_n('%d site license for 1 month', '%d sites license for 1 month', licenses), licenses);
	}
	if ('annual' === cycle) {
		/* translators: %d: Number of sites. */
		return sprintf(_n('%d site license for 1 year', '%d sites license for 1 year', licenses), licenses);
	}
	/* translators: %d: Number of sites. */
	return sprintf(_n('%d site license for lifetime', '%d sites license for lifetime', licenses), licenses);
};

const Plan = ({ pricingInfo, product, price, cycle, options }) => {
	const { logo, planId, button, featured } = pricingInfo;
	const { title, id, public_key, icon } = product || {};
	const { licenses } = price || {};

	const amount = price?.[cycle] + '';

	const name = !licenses ? __('Unlimited Sites') : (licenses === 1 ? __('Single Site') : sprintf(
		/* translators: %d: Number of sites. */
		_n('%d Site', '%d Sites', licenses),
		licenses
	));
	const isFeatured = featured?.selected === (licenses || 'null');

	return <div className={`plan ${isFeatured ? 'bestValue' : ''}`} data-best-text={featured?.text}>
		<h3 className='planName wp-block-heading'>{name}</h3>

		<div className='price'>
			${amount}
		</div>

		<p className='note'>{getLicenseNote(licenses, cycle)}</p>

		<ul className={`wp-block-list features checkList ${isFeatured ? 'whiteCheck' : 'themeCheck'}`}>
			{getFeatures(product.plans, planId).map((f, i) => <li key={i} dangerouslySetInnerHTML={{ __html: f }} />)}
		</ul>

		<Button className={`${isFeatured ? 'white' : ''}`} onClick={e => {
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
	</div>
}