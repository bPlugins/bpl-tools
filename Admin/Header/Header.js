import './style.scss';

const Header = (props) => {
	const { name, logo, version, children } = props;

	return <div className='bPlDashboardHeader'>
		<div className='bPlDashboardContainer'>
			<div className='pluginInfo' wrap={true}>
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