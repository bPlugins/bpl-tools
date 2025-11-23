/**
 * FSCheckoutForm Component
 * Renders a Freemius checkout iframe for purchasing plugin plans.
 *
 * Props:
 * - freemius: object (contains product_id and plan_id)
 * - options: object (additional checkout options)
 *
 * For more information, see:
 * https://freemius.com/help/documentation/checkout/freemius-checkout-buy-button/
 */
import { useState } from 'react';
import './style.scss';
import Loading from '../../Components/Loading/Loading';

const FSCheckoutForm = ({ freemius, options }) => {
	const { product_id, plan_id } = freemius;

	const params = Object.keys(options).map(key => `${key}=${options[key]}`).join('&');

	const [isLoading, setIsLoading] = useState(true);

	return <div className='bPlDashboardFSCheckoutForm bPlDashboardBox'>
		{isLoading && <Loading text={false} iconSize='3rem' iconThickness='5px' />}

		<iframe
			src={`https://checkout.freemius.com/plugin/${product_id}/plan/${plan_id}?${params}`}
			loading={isLoading}
			onLoad={() => setIsLoading(false)}
		/>
	</div>
}
export default FSCheckoutForm;