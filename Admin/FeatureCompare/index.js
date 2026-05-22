import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '../../Components/Button/Button';
import '../lib/fs';
import './style.scss';

import { checkCircleIcon, closeIcon, searchIcon } from '../utils/icons';

/**
 * Free vs Pro feature comparison table — fetches live plan data, renders plan price
 * cards, a searchable feature breakdown table, and a Pro CTA banner.
 *
 * @param {string[]} props.plans            - Plan names to compare, e.g. ['free', 'pro']
 * @param {object}   props.freemius         - {product_id, public_key} — spread from dashboardInfo via props
 * @param {object}   [props.hero]           - Override hero: {eyebrow?, title?, description?}
 * @param {object}   [props.ctaBanner]      - Override CTA banner: {title?, description?, ctaLabel?}
 * @param {object}   [props.planDescriptions] - Override plan taglines: {free?, pro?}
 */
const FeatureCompare = ({ plans: planNames = ['free', 'pro'], freemius, hero: heroProp, ctaBanner: ctaBannerProp, planDescriptions }) => {
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
			.then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
			.then(data => { if (mounted) setProduct(data); })
			.catch(() => { if (mounted) setProduct({}); })
			.finally(() => { if (mounted) setIsLoading(false); });
		return () => { mounted = false; };
	}, [product_id]);

	useEffect(() => {
		if (!product?.id) return;
		const visiblePlans = product?.plans?.filter(p => planNames.includes(p.name)) || [];
		const proPlan = visiblePlans.find(p => p.name !== 'free') || visiblePlans[0] || {};
		const singlePrices = proPlan?.pricing?.[0];

		if (singlePrices && typeof singlePrices === 'object') {
			const c = [];
			if (singlePrices.monthly !== undefined) c.push({ name: 'monthly', label: __('Monthly'), short: '/mo' });
			if (singlePrices.annual !== undefined) c.push({ name: 'annual', label: __('Yearly'), short: '/yr', isDefault: true });
			if (singlePrices.lifetime !== undefined) c.push({ name: 'lifetime', label: __('Lifetime'), short: __('one-time') });
			setCycles(c);
			setCycle(c.find(cc => cc.isDefault)?.name || c[0]?.name || '');
		} else {
			setCycles([]);
			setCycle('');
		}
	}, [product]);

	if (isLoading) {
		return <div className='bPlDashboardFeatureCompare bPlDashboardFeatureCompareLoading'>
			<div className='fcSpinner' />
			<p>{__('Loading feature comparison…')}</p>
		</div>;
	}

	if (!product?.id) return null;

	const visiblePlans = product?.plans?.filter(p => planNames.includes(p.name)) || [];
	const proPlan = visiblePlans.find(p => p.name !== 'free');

	const baseFeatures = visiblePlans[visiblePlans.length - 1]?.features || [];
	const features = baseFeatures.map(bf => {
		const presentIn = visiblePlans
			.filter(p => p.features.some(f => f.title === bf.title))
			.map(p => p.id);
		return { ...bf, plans: presentIn };
	});
	visiblePlans.forEach(p => {
		p.features.forEach(f => {
			if (!features.some(x => x.title === f.title)) {
				features.push({ ...f, plans: [p.id] });
			}
		});
	});

	const freePlan = visiblePlans.find(p => p.name === 'free');
	features.sort((a, b) => {
		const aInFree = freePlan ? a.plans?.includes(freePlan.id) : false;
		const bInFree = freePlan ? b.plans?.includes(freePlan.id) : false;
		if (aInFree === bInFree) return 0;
		return aInFree ? -1 : 1;
	});

	let annualSavingsPct = 0;
	const samplePricing = proPlan?.pricing?.find(p => parseInt(p.licenses) === 1);
	if (samplePricing?.monthly && samplePricing?.annual) {
		const full = parseFloat(samplePricing.monthly) * 12;
		const annual = parseFloat(samplePricing.annual);
		if (full > 0) annualSavingsPct = Math.round(((full - annual) / full) * 100);
	}

	const proOnlyCount = features.filter(f => f.plans.length === 1 && proPlan && f.plans[0] === proPlan.id).length;

	const q = query.trim().toLowerCase();
	const filteredFeatures = q ? features.filter(f => f.title.replace(/<[^>]+>/g, '').toLowerCase().includes(q)) : features;

	const hero = {
		eyebrow: heroProp?.eyebrow ?? __('Compare'),
		title: heroProp?.title ?? __('Free vs Pro at a glance'),
	};

	const ctaBanner = {
		title: ctaBannerProp?.title ?? __('Ready to unlock everything?'),
		description: ctaBannerProp?.description ?? __('Upgrade to Pro and get every feature, future updates, and priority support — backed by a 14 days money-back guarantee.'),
		ctaLabel: ctaBannerProp?.ctaLabel ?? __('Get Pro now →'),
	};

	const currentCycle = cycles.find(c => c.name === cycle);

	return <div className='bPlDashboardFeatureCompare'>
		<header className='fcHero'>
			<span className='fcEyebrow'>{hero.eyebrow}</span>
			<h1>{hero.title}</h1>
			<p>
				{heroProp?.description
					? heroProp.description
					: <>{__('See exactly what unlocks when you upgrade.')}{' '}<strong>{proOnlyCount}</strong>{' '}{proOnlyCount === 1 ? __('feature is') : __('features are')}{' '}{__('exclusive to Pro.')}</>
				}
			</p>
		</header>

		{cycles.length > 1 && <div className='fcCycleWrap'>
			<div className='fcCycle' role='tablist'>
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
						{c.name === 'annual' && annualSavingsPct > 0 && <span className='fcSave'>{`Save ${annualSavingsPct}%`}</span>}
					</button>
				))}
			</div>
		</div>}

		<div className='fcPlans'>
			{visiblePlans.map(plan => {
				const isFree = plan.name === 'free';
				const price = Array.isArray(plan.pricing) ? plan.pricing.find(p => parseInt(p.licenses) === 1)?.[cycle] : '0';
				const suffix = currentCycle?.short || '';
				const cycleText = currentCycle?.label || '';
				const freeDesc = planDescriptions?.free ?? __('Free forever — all the essentials to get started.');
				const proDesc = planDescriptions?.pro ?? __('Everything in Free, plus advanced features and priority support.');

				return <div key={plan.id} className={`fcPlan ${isFree ? 'isFree' : 'isPro'}`}>
					<div className='fcPlanHead'>
						<div className='fcPlanTag'>{isFree ? __('Free') : __('Pro')}</div>
						<h3>{plan.title}</h3>
						<p>{isFree ? freeDesc : proDesc}</p>
					</div>

					<div className='fcPlanPrice'>
						<span className='fcCurr'>$</span>
						<span className='fcAmt'>{isFree ? '0' : (price || '—')}</span>
						<span className='fcCyc'>
							{isFree
								? __('forever')
								: (suffix === __('one-time') ? __('one-time') : `${suffix} · ${__('billed')} ${cycleText.toLowerCase()}`)
							}
						</span>
					</div>

					{isFree
						? <div className='fcPlanCtaHave' aria-disabled='true'>
							{checkCircleIcon}
							{__('You Already Have It')}
						</div>
						: <Button
							className='fcPlanCta'
							onClick={e => {
								e.preventDefault();
								// eslint-disable-next-line no-undef
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
							{__('Get Pro →')}
						</Button>
					}
				</div>;
			})}
		</div>

		<div className='fcTableWrap'>
			<div className='fcTableHead'>
				<h2>{__('Feature breakdown')}</h2>

				<div className='fcSearchBox'>
					{searchIcon}
					<input
						type='text'
						placeholder={__('Filter features…')}
						value={query}
						onChange={e => setQuery(e.target.value)}
					/>
					{query && <button type='button' onClick={() => setQuery('')} aria-label={__('Clear filter')}>×</button>}
				</div>
			</div>

			<div className='fcTableScroll'>
				<table className='fcTable'>
					<thead>
						<tr>
							<th>{__('Feature')}</th>
							{visiblePlans.map(p => (
								<th key={p.id} className={p.name === 'free' ? 'isFreeCol' : 'isProCol'}>
									{p.name === 'free' ? __('Free') : __('Pro')}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredFeatures.length === 0
							? <tr>
								<td colSpan={visiblePlans.length + 1} className='fcEmpty'>
									{__('No features match your search.')}
								</td>
							</tr>
							: filteredFeatures.map((feature, i) => {
								const isProOnly = proPlan && feature.plans.length === 1 && feature.plans[0] === proPlan.id;
								return <tr key={i} className={isProOnly ? 'isProOnly' : ''}>
									<td>
										<span dangerouslySetInnerHTML={{ __html: feature.title }} />
										{isProOnly && <span className='fcRowTag'>{__('Pro only')}</span>}
									</td>
									{visiblePlans.map(plan => {
										const has = feature.plans?.includes(plan.id);
										return <td key={plan.id} className={plan.name === 'free' ? 'isFreeCol' : 'isProCol'}>
											<span className={`fcCell ${has ? 'isCheck' : 'isCross'}`} aria-label={has ? __('Included') : __('Not included')}>
												{has ? checkCircleIcon : closeIcon}
											</span>
										</td>;
									})}
								</tr>;
							})
						}
					</tbody>
				</table>
			</div>
		</div>

		{proPlan && <section className='fcCtaBanner'>
			<div>
				<h2>{ctaBanner.title}</h2>
				<p>{ctaBanner.description}</p>
			</div>

			<Button
				className='fcPlanCta'
				onClick={e => {
					e.preventDefault();
					// eslint-disable-next-line no-undef
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
				{ctaBanner.ctaLabel}
			</Button>
		</section>}
	</div>;
};
export default FeatureCompare;
