import Button from '../../Components/Button/Button';
import './style.scss';

/**
 * Renders the header for the plugin's dashboard page.
 *
 * @param {object} props - The component props.
 * @param {string} [props.name] - The name of the plugin.
 * @param {string} [props.media.logo] - The URL for the plugin's logo.
 * @param {string|number} [props.version] - The version number of the plugin.
 * @param {React.ReactNode} [props.children] - The navigation links or other elements to be rendered in the header.
 * @returns {JSX.Element} The rendered header component.
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
			{displayOurPlugins && <a href='#our-plugins'>Our Plugins</a>}

			{!isPremium && <Button href='#pricing'>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 13' fill='none'>
					<path d='M2.5 5.16931V3.16931C2.49936 2.5198 2.73579 1.89239 3.16492 1.40483C3.59404 0.917267 4.18636 0.603088 4.8307 0.521257C5.47503 0.439426 6.12708 0.595571 6.66446 0.960383C7.20184 1.3252 7.5876 1.87359 7.74933 2.50264M5.16667 8.50264C5.34348 8.50264 5.51305 8.43241 5.63807 8.30738C5.76309 8.18236 5.83333 8.01279 5.83333 7.83598C5.83333 7.65917 5.76309 7.4896 5.63807 7.36457C5.51305 7.23955 5.34348 7.16931 5.16667 7.16931C4.98986 7.16931 4.82029 7.23955 4.69526 7.36457C4.57024 7.4896 4.5 7.65917 4.5 7.83598C4.5 8.01279 4.57024 8.18236 4.69526 8.30738C4.82029 8.43241 4.98986 8.50264 5.16667 8.50264ZM5.16667 8.50264V10.5026M1.56667 5.16931H8.76667C9.35333 5.16931 9.83333 5.64931 9.83333 6.23598V10.9026C9.83333 11.7826 9.11333 12.5026 8.23333 12.5026H2.1C1.22 12.5026 0.5 11.7826 0.5 10.9026V6.23598C0.5 5.64931 0.98 5.16931 1.56667 5.16931Z' stroke='currentColor' strokeLinecap='round' />
				</svg>
				Upgrade Pro
			</Button>}
		</div>
	</div>
};
export default Header;