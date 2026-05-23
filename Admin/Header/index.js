import { useState, cloneElement, isValidElement, Children } from 'react';
import Button from '../../Components/Button/Button';
import { ourPluginsIcon, upgradeProIcon } from '../utils/icons';

import './style.scss';

/**
 * Dashboard page header — logo, plugin name, version badge, nav slot, and action buttons.
 *
 * @param {object}        props
 * @param {string}        props.name              - Plugin name displayed as <h1>
 * @param {string}        props.version           - Version string, rendered as v{version}
 * @param {boolean}       props.isPremium         - Hides "Upgrade Pro" button; switches Our Plugins to Button
 * @param {object}        [props.media]           - {logo?} — plugin logo image URL
 * @param {boolean}       [props.displayOurPlugins] - Shows the "Our Plugins" button when true
 * @param {React.ReactNode} [props.children]      - Nav links rendered between the plugin info and action buttons
 */
const Header = (props) => {
	const { name, media, version, isPremium, displayOurPlugins, children } = props;
	const { logo } = media || {};
	const [isNavOpen, setIsNavOpen] = useState(false);

	// Inject 'open' class onto the nav child and close menu on link click
	const enhancedChildren = Children.map(children, child => {
		if (!isValidElement(child)) return child;
		const cls = child.props.className || '';
		if (!cls.includes('bPlDashboardNav')) return child;
		return cloneElement(child, {
			className: `${cls}${isNavOpen ? ' open' : ''}`,
			onClick: (e) => {
				child.props.onClick?.(e);
				setIsNavOpen(false);
			}
		});
	});

	return <div className='bPlDashboardHeader'>
		<div className='pluginInfo' wrap={true}>
			{logo && <img src={logo} alt={name || 'Plugin from bPlugins'} />}
			{name && <h1>{name}</h1>}
			{version && <div className='pluginVersion'>v{version}</div>}
		</div>

		<button
			className={`bplHamburger${isNavOpen ? ' open' : ''}`}
			onClick={() => setIsNavOpen(v => !v)}
			aria-label='Toggle navigation'
			aria-expanded={isNavOpen}
		>
			<span />
			<span />
			<span />
		</button>

		{enhancedChildren}

		<div className='navButtons'>
			{displayOurPlugins && (
				isPremium ?
					<Button href='#our-plugins'>
						{ourPluginsIcon}
						Our Plugins
					</Button> :
					<a className='linkButton' href='#our-plugins'>Our Plugins</a>
			)}

			{!isPremium && <Button className='upgrade' href='#pricing'>
				{upgradeProIcon}
				Upgrade Pro
			</Button>}
		</div>
	</div>
};
export default Header;
