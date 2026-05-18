import { useState } from 'react';

import Loading from '../../Components/Loading/Loading';

import './style.scss';
/**
 * FSCheckoutForm Component
 * Renders a Freemius checkout iframe for purchasing plugin plans.
 *
 * @param {object} props - Component props
 * @param {object} props.freemius - Freemius configuration {product_id, plan_id}
 * @param {object} props.options - Additional checkout options
 * @returns {JSX.Element}
 */

const FSCheckoutForm = ({ freemius, options }) => {
	const { product_id, plan_id } = freemius;

	const params = Object.keys(options).map(key => `${key}=${options[key]}`).join('&');

	const [isLoading, setIsLoading] = useState(true);

	return <div className='bPlDashboardFSCheckoutForm bPlDashboardCard'>
		{isLoading && <Loading text={false} iconSize='3rem' iconThickness='5px' />}

		<iframe
			src={`https://checkout.freemius.com/plugin/${product_id}/plan/${plan_id}?${params}`}
			loading={isLoading}
			onLoad={() => setIsLoading(false)}
		/>
	</div>
}
export default FSCheckoutForm;