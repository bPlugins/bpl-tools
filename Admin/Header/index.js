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
	const { logo } = media || {}

	return <div className='bPlDashboardHeader'>
		<div className='pluginInfo' wrap={true}>
			{logo && <img src={logo} alt={name || 'Plugin from bPlugins'} />}
			{name && <h1>{name}</h1>}
			{version && <div className='pluginVersion'>v{version}</div>}
		</div>

		{children}

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