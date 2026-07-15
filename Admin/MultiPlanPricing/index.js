/**
	* MultiPlanPricing Component
	*
	* @props pricingInfo (required): {pluginId, planIds, licenses, button, featured, logo?, hero?, trustBadges?, faqs?} plan config (Object)
	* @props options (required): extra options forwarded to FS.Checkout.open() (Object)
	*/

import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '../../Components/Button/Button';
import FS from '../lib/fs';
import './style.scss';

import { checkCircleIcon, chevronDownIcon, moneyBackIcon, refreshIcon, chatIcon, lockIcon } from '../utils/icons';

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

const MultiPlanPricing = ({ pricingInfo, options }) => {
	const {
		pluginId, planIds, licenses, button, featured, logo,
		hero: heroProp,
		trustBadges: customTrustBadges,
		faqs: customFaqs,
	} = pricingInfo;

	const [product, setProduct] = useState({});
	const [isProductLoading, setIsProductLoading] = useState(false);
	const [cycles, setCycles] = useState([]);
	const [cycle, setCycle] = useState('');
	const [openFaq, setOpenFaq] = useState(0);
	const [selectedLicense, setSelectedLicense] = useState(null);

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
		if (!product?.id || !planIds?.length) return;
		const { plans } = product;

		const relevantPlans = planIds.map(id =>
			plans?.find(p => parseInt(p.id) === parseInt(id))
		).filter(Boolean);

		if (relevantPlans.length === 0) return;

		const firstPlan = relevantPlans[0];
		const singlePrices = firstPlan?.pricing?.[0];

		if (singlePrices && typeof singlePrices === 'object') {
			const c = [];
			if (singlePrices.monthly !== undefined) c.push({ name: 'monthly', label: __('Monthly') });
			if (singlePrices.annual !== undefined) c.push({ name: 'annual', label: __('Yearly'), isDefault: true });
			if (singlePrices.lifetime !== undefined) c.push({ name: 'lifetime', label: __('Lifetime') });
			setCycles(c);
			setCycle(c.find(cc => cc.isDefault)?.name || c[0]?.name || '');
		} else {
			setCycles([]);
			setCycle('');
		}

		if (licenses?.length > 0) {
			setSelectedLicense(licenses[0]);
		}
	}, [product, planIds, licenses]);

	if (isProductLoading) {
		return <div className='bPlDashboardPricing bPlDashboardPricingLoading'>
			<div className='pricingLoadingSpinner' />
			<p>{__('Loading the latest pricing…')}</p>
		</div>;
	}

	if (!product?.id) return null;

	const { plans } = product;
	const relevantPlans = planIds.map(id =>
		plans?.find(p => parseInt(p.id) === parseInt(id))
	).filter(Boolean);

	if (relevantPlans.length === 0) return null;

	const samplePrice = relevantPlans[0]?.pricing?.[0];
	let annualSavingsPct = 0;
	if (samplePrice?.monthly && samplePrice?.annual) {
		const fullYear = parseFloat(samplePrice.monthly) * 12;
		const annual = parseFloat(samplePrice.annual);
		if (fullYear > 0) annualSavingsPct = Math.round(((fullYear - annual) / fullYear) * 100);
	}

	const annualSavingsLabel = annualSavingsPct > 0 ? `Save ${annualSavingsPct}%` : '';
	const isLifetimeOnly = cycles.length === 1 && cycles[0]?.name === 'lifetime';

	const hero = {
		eyebrow: heroProp?.eyebrow ?? __('Pricing'),
		title: heroProp?.title ?? __('Pick the plan that fits your project'),
		description: heroProp?.description ?? __('Same powerful features on every plan — just choose how many sites you need. Upgrade or downgrade any time.'),
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

		<div className='pricingPlans isMultiPlan'>
			{relevantPlans.map((plan, planIndex) => {
				const pricing = plan?.pricing || [];
				const selectedPrice = pricing.find(p => (p?.licenses ?? null) === selectedLicense);
				const isFeatured = featured?.planId ? featured.planId === plan.id : plan.name === 'pro';
				const amount = selectedPrice?.[cycle];
				const cycleInfo = cycleMeta[cycle] || { suffix: '' };
				const numericAmount = parseFloat(amount);
				const monthlyEquivalent = cycle === 'annual' && selectedPrice?.annual ? (parseFloat(selectedPrice.annual) / 12) : null;
				const perSite = selectedLicense && !isNaN(numericAmount) ? (numericAmount / selectedLicense) : null;
				const planFeatures = plan?.features?.map(f => f.title) || [];

				return <div key={planIndex} className={`pricingPlan ${isFeatured ? 'isFeatured' : ''}`}>
					{isFeatured && <div className='pricingBadge'>{featured?.text || __('Most Popular')}</div>}

					<div className='pricingPlanHead'>
						<h3>{plan.title}</h3>
						<p>{plan.description}</p>
					</div>

					{licenses && licenses.length > 1 && <div className='pricingLicenseSwitcher'>
						{licenses.map(license => {
							const label = !license
								? __('Unlimited Sites')
								: (license === 1 ? __('Single Site') : `${license} ${__('Sites')}`);
							return <button
								key={license}
								type='button'
								className={`pricingLicenseBtn ${selectedLicense === license ? 'isActive' : ''}`}
								onClick={() => setSelectedLicense(license)}
							>
								{label}
							</button>;
						})}
					</div>}

					{selectedPrice && <div className='pricingPriceWrap'>
						<div className='pricingPrice'>
							<span className='pricingCurrency'>$</span>
							<span className='pricingAmount'>{formatPrice(amount)}</span>
							{cycleInfo.suffix && <span className='pricingSuffix'>{cycleInfo.suffix}</span>}
						</div>

						{perSite !== null && <p className='pricingEquiv'>≈ ${formatPrice(perSite)} {__('per site')}</p>}
						{!selectedLicense && <p className='pricingEquiv'>{__('Use on every site you build.')}</p>}
						{monthlyEquivalent !== null && cycle === 'annual' && <p className='pricingEquiv'>
							{__('Billed yearly')} · ${formatPrice(monthlyEquivalent)}/mo
						</p>}
						{cycle === 'lifetime' && <p className='pricingEquiv'>{__('One-time payment, pay once forever.')}</p>}
						{cycle === 'monthly' && <p className='pricingEquiv'>{__('Billed monthly, cancel anytime.')}</p>}

						{planFeatures.length > 0 && <ul className='pricingMultiPlanFeatures'>
							{planFeatures.map((f, i) => (
								<li key={i}>
									<span className='pricingFeatureCheck'>{checkCircleIcon}</span>
									<span dangerouslySetInnerHTML={{ __html: f }} />
								</li>
							))}
						</ul>}
					</div>}

					{selectedPrice && <Button
						className='pricingCta'
						onClick={e => {
							e.preventDefault();
							new FS.Checkout({
								plugin_id: product.id,
								plan_id: plan.id,
								public_key: product.public_key
							}).open({
								image: logo || product.icon,
								title: product.title,
								licenses: selectedLicense,
								billing_cycle: cycle,
								...options
							});
						}}
					>
						{button.label}
					</Button>}
				</div>;
			})}
		</div>

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

export default MultiPlanPricing;
