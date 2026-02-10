import './style.scss';

/**
 * Renders the header for the plugin's dashboard page.
 *
 * @param {object} props - The component props.
 * @param {string} [props.name] - The name of the plugin.
 * @param {string} [props.logo] - The URL for the plugin's logo.
 * @param {string|number} [props.version] - The version number of the plugin.
 * @param {React.ReactNode} [props.children] - The navigation links or other elements to be rendered in the header.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = (props) => {
	const { name, logo, version, children } = props;

	return <div className='bPlDashboardHeader'>
		<div className='bPlDashboardContainer'>
			<div className='pluginInfo'>
				<div>
					{logo && <img className='pluginLogo' src={logo} alt={name || 'Plugin from bPlugins'} />}

					{name && <h1 className='pluginName'>{name}</h1>}
				</div>

				{version && <div className='pluginVersion'>v{version}</div>}
			</div>

			<div className='navLinks'>
				{children}
			</div>
		</div>
	</div>
};
export default Header;