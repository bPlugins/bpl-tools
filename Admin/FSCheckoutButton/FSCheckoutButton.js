import Button from '../../Components/Button/Button';

import '../lib/fs';

/**
 * FSCheckoutButton Component
 * Renders a Freemius checkout button for purchasing plugin plans.
 *
 * Props:
 * - freemius: object (contains product_id, plan_id, and public_key)
 * - options: object (additional checkout options)
 *
 * For more information, see:
 * https://freemius.com/help/documentation/checkout/freemius-checkout-buy-button/
 */
const FSCheckoutButton = ({ freemius, options, buttonProps, children }) => {
	const onUpgrade = (e) => {
		e.preventDefault();
		// eslint-disable-next-line no-undef
		const checkoutConfig = new FS.Checkout(freemius);
		checkoutConfig.open(options);
	};

	return <Button onClick={onUpgrade} {...buttonProps}>
		{children}
	</Button>
}
export default FSCheckoutButton;