/**
	* Pricing Component
	*
	* @props pricingInfo (required): {pluginId, planId, licenses, cycles?, button, featured, logo?, hero?, included?, trustBadges?, faqs?} plan config (Object). cycles: which billing cycle tabs to show, e.g. ['monthly', 'annual', 'lifetime'] (default all)
	* @props options (required): extra options forwarded to FS.Checkout.open() (Object)
	*/

import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '../../Components/Button/Button';
import FS from '../lib/fs';
import './style.scss';

import { checkCircleIcon, chevronDownIcon, moneyBackIcon, refreshIcon, chatIcon, lockIcon } from '../utils/icons';

export const getFeatures = (plans, planId) => {
	const freeFeatures = plans.find(p => p.name === 'free')?.features?.map(f => f.title);
	const proFeatures = plans.find(p => p.name === 'pro')?.features?.filter(f => !freeFeatures.includes(f.title)).map(f => f.title);

	const features = {
		'free': freeFeatures,
		'pro': proFeatures
	};

	const planName = plans.find(p => parseInt(p.id) === parseInt(planId))?.name;
	const planFeatures = features[planName] || plans.find(p => parseInt(p.id) === parseInt(planId))?.features?.map(f => f.title);

	return planFeatures || [];
};

const cycleMeta = {
	monthly: { suffix: '/mo' },
	annual: { suffix: '/yr' },
	lifetime: { suffix: '' }
};

const formatPrice = (amount) => {
	const num = typeof amount === 'string' ? parseFloat(amount) : amount;
	if (isNaN(num)) return '—';
	return Number.isInteger(num) ? String(num) : num.toFixed(2);
};

const Pricing = ({ pricingInfo, options }) => {
	const {
		pluginId, planId, licenses, cycles: enabledCycles = ['monthly', 'annual', 'lifetime'], button, featured, logo,
		hero: heroProp,
		included: includedProp,
		trustBadges: customTrustBadges,
		faqs: customFaqs,
	} = pricingInfo;

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
			.then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
			.then(data => { if (mounted) setProduct(data); })
			.catch(() => { if (mounted) setProduct({}); })
			.finally(() => { if (mounted) setIsProductLoading(false); });
		return () => { mounted = false; };
	}, [pluginId]);

	useEffect(() => {
		if (!product?.id || !planId) return;
		const { plans } = product;
		const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
		const singlePrices = plan?.pricing?.[0];

		if (singlePrices && typeof singlePrices === 'object') {
			const all = [];
			if (singlePrices.monthly !== undefined) all.push({ name: 'monthly', label: __('Monthly') });
			if (singlePrices.annual !== undefined) all.push({ name: 'annual', label: __('Yearly'), isDefault: true });
			if (singlePrices.lifetime !== undefined) all.push({ name: 'lifetime', label: __('Lifetime') });

			const filtered = all.filter(cc => enabledCycles.includes(cc.name));
			const c = filtered.length ? filtered : all; // fall back to all if config filters everything out
			setCycles(c);
			setCycle(c.find(cc => cc.isDefault)?.name || c[0]?.name || '');
		} else {
			setCycles([]);
			setCycle('');
		}
	}, [product, planId]);

	if (isProductLoading) {
		return <div className='bPlDashboardPricing bPlDashboardPricingLoading'>
			<div className='pricingLoadingSpinner' />
			<p>{__('Loading the latest pricing…')}</p>
		</div>;
	}

	if (!product?.id) return null;

	const { plans } = product;
	const plan = plans?.find(p => parseInt(p.id) === parseInt(planId)) || plans?.[0] || {};
	const pricing = plan?.pricing || [];
	const visiblePricing = licenses?.length > 0 ? pricing.filter(p => licenses.includes(p?.licenses ?? null)) : pricing;

	const samplePrice = visiblePricing[0];
	let annualSavingsPct = 0;
	if (samplePrice?.monthly && samplePrice?.annual) {
		const fullYear = parseFloat(samplePrice.monthly) * 12;
		const annual = parseFloat(samplePrice.annual);
		if (fullYear > 0) annualSavingsPct = Math.round(((fullYear - annual) / fullYear) * 100);
	}

	const sharedFeatures = getFeatures(plans, planId);
	const annualSavingsLabel = annualSavingsPct > 0 ? `Save ${annualSavingsPct}%` : '';

	const isLifetimeOnly = cycles.length === 1 && cycles[0]?.name === 'lifetime';

	const hero = {
		eyebrow: heroProp?.eyebrow ?? __('Pricing'),
		title: heroProp?.title ?? __('Pick the plan that fits your project'),
		description: heroProp?.description ?? __('Same powerful features on every plan — just choose how many sites you need. Upgrade or downgrade any time.'),
	};

	const included = {
		tag: includedProp?.tag ?? __('Same on every plan'),
		title: includedProp?.title ?? __('Everything you get, on every license'),
		description: includedProp?.description ?? __('Every feature is available on every license tier. The only difference is how many sites you can activate the plugin on.'),
	};

	const trustBadges = customTrustBadges || [
		{ title: __('14 days money back'), body: __('Risk-free purchase'), icon: moneyBackIcon },
		{ title: isLifetimeOnly ? __('Lifetime updates') : __('Plugins updates'), body: __('On every plan'), icon: refreshIcon },
		{ title: __('Priority support'), body: __('Get help when you need it'), icon: chatIcon },
		{ title: __('Secure checkout'), body: __('Powered by Freemius'), icon: lockIcon }
	];

	const faqs = customFaqs || [
		{
			q: __('Can I upgrade my plan later?'),
			a: __('Yes — you can upgrade any time from your account. We prorate the difference automatically.')
		},
		isLifetimeOnly ? {
			q: __('Will I receive updates if I purchase a lifetime license?'),
			a: __('Yes, a lifetime license holds lifetime updates and never expires, ensuring you always have access to the latest features and bug fixes without recurring fees.')
		} : {
			q: __('What happens after my license expires?'),
			a: __('The plugin keeps working forever. You only lose access to premium features, updates and premium support unless you renew.')
		},
		{
			q: __('Do you offer refunds?'),
			a: __('Absolutely. Every plan is backed by a 14 days no-questions-asked money-back guarantee.')
		}
	];

	return <div className='bPlDashboardPricing'>
		<header className='pricingHero'>
			<span className='pricingEyebrow'>{hero.eyebrow}</span>
			<h1>{hero.title}</h1>
			<p>{hero.description}</p>
		</header>

		{cycles.length > 1 && <div className='pricingCycleWrap'>
			<div className='pricingCycle' role='tablist'>
				{cycles.map(c => (
					<button
						key={c.name}
						type='button'
						role='tab'
						aria-selected={c.name === cycle}
						className={c.name === cycle ? 'isActive' : ''}
						onClick={() => setCycle(c.name)}
					>
						{c.label}
						{c.name === 'annual' && annualSavingsLabel && <span className='pricingSave'>{annualSavingsLabel}</span>}
					</button>
				))}
			</div>
		</div>}

		<div className='pricingPlans'>
			{visiblePricing.length ? visiblePricing.map((price, index) => {
				const licensesCount = price?.licenses;
				const isFeatured = featured?.selected === (licensesCount || 'null');
				const amount = price?.[cycle];
				const cycleInfo = cycleMeta[cycle] || { suffix: '' };
				const numericAmount = parseFloat(amount);
				const monthlyEquivalent = cycle === 'annual' && price?.annual ? (parseFloat(price.annual) / 12) : null;
				const perSite = licensesCount && !isNaN(numericAmount) ? (numericAmount / licensesCount) : null;

				const planLabel = !licensesCount
					? __('Unlimited Sites')
					: (licensesCount === 1 ? __('Single Site') : `${licensesCount} ${__('Sites')}`);
				const planTagline = !licensesCount
					? __('For agencies & enterprise')
					: (licensesCount === 1 ? __('For solo creators') : __('For freelancers'));

				return <div key={index} className={`pricingPlan ${isFeatured ? 'isFeatured' : ''}`}>
					{isFeatured && <div className='pricingBadge'>{featured?.text || __('Most Popular')}</div>}

					<div className='pricingPlanHead'>
						<h3>{planLabel}</h3>
						<p>{planTagline}</p>
					</div>

					<div className='pricingPriceWrap'>
						<div className='pricingPrice'>
							<span className='pricingCurrency'>$</span>
							<span className='pricingAmount'>{formatPrice(amount)}</span>
							{cycleInfo.suffix && <span className='pricingSuffix'>{cycleInfo.suffix}</span>}
						</div>

						{perSite !== null && <p className='pricingEquiv'>≈ ${formatPrice(perSite)} {__('per site')}</p>}
						{!licensesCount && <p className='pricingEquiv'>{__('Use on every site you build.')}</p>}
						{monthlyEquivalent !== null && cycle === 'annual' && <p className='pricingEquiv'>
							{__('Billed yearly')} · ${formatPrice(monthlyEquivalent)}/mo
						</p>}
						{cycle === 'lifetime' && <p className='pricingEquiv'>{__('One-time payment, pay once forever.')}</p>}
						{cycle === 'monthly' && <p className='pricingEquiv'>{__('Billed monthly, cancel anytime.')}</p>}
					</div>

					<Button
						className='pricingCta'
						onClick={e => {
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
			}) : <p className='pricingEmpty'>{__('No plans available right now.')}</p>}
		</div>

		{sharedFeatures.length > 0 && <section className='pricingIncluded'>
			<header className='pricingIncludedHead'>
				<span className='pricingIncludedTag'>{included.tag}</span>
				<h2>{included.title}</h2>
				<p>{included.description}</p>
			</header>

			<ul className='pricingIncludedGrid'>
				{sharedFeatures.map((f, i) => (
					<li key={i}>
						<span className='pricingIncludedCheck'>{checkCircleIcon}</span>
						<span dangerouslySetInnerHTML={{ __html: f }} />
					</li>
				))}
			</ul>
		</section>}

		<section className='pricingTrust'>
			{trustBadges.map((b, i) => (
				<div key={i} className='pricingTrustItem'>
					<span className='pricingTrustIcon'>{b.icon}</span>
					<div>
						<strong>{b.title}</strong>
						<span>{b.body}</span>
					</div>
				</div>
			))}
		</section>

		<section className='pricingFaq'>
			<h2>{__('Frequently asked questions')}</h2>
			<div className='pricingFaqList'>
				{faqs.map((f, i) => (
					<div key={i} className={`pricingFaqItem ${openFaq === i ? 'isOpen' : ''}`}>
						<button
							type='button'
							className='pricingFaqQ'
							aria-expanded={openFaq === i}
							onClick={() => setOpenFaq(openFaq === i ? null : i)}
						>
							<span>{f.q}</span>
							{chevronDownIcon}
						</button>
						{openFaq === i && <div className='pricingFaqA'>{f.a}</div>}
					</div>
				))}
			</div>
		</section>
	</div>;
};

export default Pricing;
