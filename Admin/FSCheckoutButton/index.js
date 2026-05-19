import Button from '../../Components/Button/Button';

import '../lib/fs';

/**
 * FSCheckoutButton Component
 * Renders a Freemius checkout button for purchasing plugin plans.
 *
 * @param {object} props - Component props
 * @param {object} props.freemius - Freemius configuration {product_id, plan_id, public_key}
 * @param {object} props.options - Additional checkout options
 * @param {object} [props.buttonProps] - Props to pass to the underlying Button component
 * @returns {JSX.Element}
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