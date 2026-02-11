import { useState } from 'react';

import Button from '../../Components/Button/Button';

import './style.scss';
import '../lib/fs';

/**
 * Pricing Component
 * Renders product pricing plans with billing cycle toggles and Freemius checkout integration.
 *
 * @param {object} props - Component props
 * @param {object} props.pricingInfo - Pricing data {cycles, plans}
 * @param {object} props.freemius - Freemius configuration
 * @returns {JSX.Element}
 */
const Pricing = (props) => {
	const { pricingInfo, children } = props;
	const { cycles, plans } = pricingInfo;

	const [cycle, setCycle] = useState(cycles?.find(c => c.isDefault)?.cycle || cycles[0]?.cycle);

	const calculateMaxAnnualDiscount = () => {
		const discounts = plans.map(plan => {
			const monthlyForYear = parseFloat(plan.prices.monthly) * 12;
			const annualPrice = parseFloat(plan.prices.annual);
			return ((monthlyForYear - annualPrice) / monthlyForYear) * 100;
		});
		return Math.max(...discounts).toFixed(0);
	};

	return <div className='bPlDashboardPricing bPlDashboardCard'>
		{children}
		{cycles?.length > 1 && <div className='cycles'>
			{cycles.map(c => {
				return <button key={c.cycle} className={c.cycle === cycle ? 'active' : ''} onClick={() => setCycle(c.cycle)}>
					{c.label} {'annual' === c.cycle && <span>{`upto ${calculateMaxAnnualDiscount()}% off`}</span>}
				</button>;
			})}
		</div>}

		{cycles?.length === 1 && cycles[0]?.cycle === 'lifetime' && <h2 className='pricingTitle'>One-time payment, lifetime access</h2>}

		<div className='plans'>
			{plans.map((plan, index) => <Plan key={index} {...props} plan={plan} cycle={cycle} />)}
		</div>
	</div>
};
export default Pricing;

const Plan = (props) => {
	const { pricingInfo, options, freemius, plan, cycle } = props;
	const { features, button, featured } = pricingInfo;
	const { name, quantity = 1, prices, pricePrefix, priceSuffix, isFeatured, note } = plan;

	const price = prices[cycle];

	const [solidPrice, cents] = price?.split('.') || [];

	return <div className={`plan ${isFeatured ? 'bestValue' : ''}`} data-best-text={featured?.text}>
		{name && <h3 className='planName wp-block-heading'>{name}</h3>}

		<div className='priceWrap'>
			{pricePrefix && <p className='prefix'>{pricePrefix}</p>}

			<p className='price'>${solidPrice}{cents && <small>.{cents}</small>}</p>

			{priceSuffix && <p className='suffix'>{priceSuffix}</p>}
		</div>

		{note && <p className='note'>{note}</p>}

		<Button className={`outline ${isFeatured ? 'white' : ''}`} onClick={e => {
			e.preventDefault();

			// eslint-disable-next-line no-undef
			new FS.Checkout({
				...freemius
			}).open({
				licenses: 'null' === quantity ? null : parseInt(quantity),
				billing_cycle: cycle,
				...options
			});
		}}>{button.label}</Button>

		<ul className={`wp-block-list features checkList ${isFeatured ? 'whiteCheck' : 'themeCheck'}`}>
			{features.map((f, i) => <li key={i}>{f}</li>)}
		</ul>
	</div>
}
