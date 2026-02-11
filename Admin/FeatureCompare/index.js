import { useEffect, useState } from 'react';

import './style.scss';
import '../lib/fs';

import Button from '../../Components/Button/Button';
import { checkIcon, closeIcon } from '../../utils/icons';

/**
 * FeatureCompare Component
 * Renders a side-by-side comparison table of free vs pro features, fetching data from bPlugins API.
 *
 * @param {object} props - Component props
 * @param {Array} [props.plans=['free', 'pro']] - Plan names to compare
 * @param {object} props.freemius - Freemius configuration {product_id, public_key}
 * @returns {JSX.Element}
 */
const FeatureCompare = ({ plans: dp = ['free', 'pro'], freemius }) => {
	const { product_id, public_key } = freemius || {};

	const [product, setProduct] = useState({});
	const [isProductLoading, setIsProductLoading] = useState(false);

	useEffect(() => {
		if (product_id) {
			let mounted = true;
			const url = `https://api.bplugins.com/wp-json/bpl/v1/products/${product_id}`;
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
	}, [product_id]);

	const [cycles, setCycles] = useState([]);
	const [cycle, setCycle] = useState(cycles?.find(c => c.isDefault)?.name || cycles[0]?.name);

	useEffect(() => {
		if (product?.id) {
			const plans = product?.plans?.filter(p => dp.includes(p.name)) || [];
			const proPlan = plans?.find(p => p.name !== 'free') || plans?.[0] || {};

			const singlePrices = proPlan?.pricing?.[0];

			if (singlePrices && typeof singlePrices === 'object') {
				let c = []
				// eslint-disable-next-line no-prototype-builtins
				if (singlePrices.hasOwnProperty('monthly')) {
					c.push({ name: 'monthly', label: 'Billed Monthly' });
				}
				// eslint-disable-next-line no-prototype-builtins
				if (singlePrices.hasOwnProperty('annual')) {
					c.push({ name: 'annual', label: 'Billed Yearly', isDefault: true });
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
	}, [product, isProductLoading]);

	if (isProductLoading) {
		return <div className='bPlDashboardBox' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<h2>Loading...</h2>
		</div>;
	}

	const plans = product?.plans?.filter(p => dp.includes(p.name)) || [];

	// Extract features from the last plan as a reference
	const baseFeatures = plans?.[plans.length - 1]?.features || [];

	// Merge features from all plans, ensuring unique titles
	const features = baseFeatures.map(baseFeature => {
		const { title } = baseFeature;
		const featurePlans = plans.map(plan => {
			return plan.features.some(feature => feature.title === title) ? plan.id : null;
		}).filter(Boolean);

		return {
			...baseFeature,
			plans: featurePlans
		};
	});

	// Add features from other plans that are not in the base features
	plans.forEach(plan => {
		plan.features.forEach(feature => {
			if (!features.some(f => f.title === feature.title)) {
				features.push({
					...feature,
					plans: [plan.id]
				});
			}
		});
	});

	return <div className='bPlDashboardFeatureCompare bPlDashboardCard'>
		<div className='featureComparePricing'>
			<div className='cyclesSelector'>
				<h2>Billing Cycle</h2>

				{cycles?.length > 1 ? <div className='cycles'>
					{cycles.map(c => {
						return <button key={c.name} className={c.name === cycle ? 'active' : ''} onClick={() => setCycle(c.name)}>
							{c.label}
						</button>;
					})}
				</div> :
					(cycles[0]?.name === 'lifetime' && <h2 className='pricingTitle'>Lifetime Access</h2>)
				}
			</div>

			{plans?.map(({ id, name, title, pricing }) => {
				const price = Array.isArray(pricing) ? pricing?.find(p => parseInt(p?.licenses) === 1)?.[cycle] : '0.00';

				return <div key={id} className={`plan ${'free' === name ? 'free' : 'premium'}`}>
					<h3>{title}</h3>

					<div className='price'>${price}</div>

					<p className='note'>{'free' === name ? 'Free forever' : `1 site license for ${'monthly' === cycle ? '1 month' : ('annual' === cycle ? '1 year' : cycle)}`}</p>

					{'free' === name ? <Button href='#pricing'>It&apos;s Free, See Pricing</Button> : <Button onClick={e => {
						e.preventDefault();

						// eslint-disable-next-line no-undef
						new FS.Checkout({
							plugin_id: product_id,
							plan_id: id,
							public_key
						}).open({
							licenses: 1,
							billing_cycle: cycle
						});
					}}>Get Started</Button>}
				</div>
			})}
		</div>

		<table>
			<thead>
				<tr>
					<th>Features</th>
					{plans.map(plan => <th key={plan.id}>
						{/* {plan.title} */}
					</th>)}
				</tr>
			</thead>
			<tbody>
				{features?.map((feature, index) => {
					const { title, plans: featurePlans } = feature;

					return <tr key={index}>
						<td dangerouslySetInnerHTML={{ __html: title }} />

						{plans.map(plan => {
							const { id } = plan;
							return <td key={id}>
								<span className={`icon ${featurePlans?.includes(id) ? 'check' : 'cross'}`}>{featurePlans?.includes(id) ? checkIcon : closeIcon}</span>
							</td>
						})}
					</tr>
				})}
			</tbody>
		</table>
	</div>;
};
export default FeatureCompare;