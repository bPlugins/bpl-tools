/**
 * Button Component
 * Renders a button or anchor element based on the presence of an onClick handler.
 *
 * Props:
 * - label: string (button/anchor text)
 * - href: string (anchor href)
 * - target: string (anchor target)
 * - onClick: function (button click handler)
 * - className: string (additional CSS classes)
 * - variant: string (button style variant)
 * - size: string (button size)
 * - ...props: any other props
 */

import './style.scss';

const Button = ({ href = '', target = '', onClick = null, className, variant = 'primary', size = '', children, ...props }) => {
	const cls = `bPlButton ${variant ? `variant-${variant}` : ''} ${size ? `size-${size}` : ''} ${className ? className : ''}`;

	return 'function' === typeof onClick ?
		<button className={cls} {...props} onClick={onClick}>
			{children}
		</button> :
		<a href={href} target={target} className={cls} {...props}>
			{children}
		</a>
}
export default Button;