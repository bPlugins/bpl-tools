/**
	* Button Component
	* Renders a button or anchor element based on the presence of an onClick/href.
	*
	* @props type (optional): 'button' (String)
	* @props href (optional): Anchor href; renders an <a> when set (String)
	* @props target (optional): Anchor target (String)
	* @props onClick (optional): Button click handler (Function)
	* @props className (optional): Additional CSS classes (String)
	* @props variant (optional): 'primary' Button style variant (String)
	* @props size (optional): '' Button size (String)
	* @props children (optional): Button content (Node)
	* @props disabled (optional): false (Boolean)
	*/

import './style.scss';

const Button = ({ type = 'button', href = '', target = '', onClick = null, className, variant = 'primary', size = '', children, disabled = false, ...props }) => {
	const cls = `bPlButton ${variant ? `variant-${variant}` : ''} ${size ? `size-${size}` : ''} ${className ? className : ''} ${disabled ? 'bPlButton-disabled' : ''}`;

	return ('function' === typeof onClick || !href) ?
		<button type={type} className={cls} {...props} onClick={onClick}>
			{children}
		</button> :
		<a href={href} target={target} className={cls} {...props}>
			{children}
		</a>
}
export default Button;