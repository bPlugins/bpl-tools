import { HashRouter } from 'react-router-dom';

import App from './App';

/**
 * Admin component for Image Compare Block
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Plugin name
 * @param {array} props.features - Plugin features
 * @param {string} props.version - Plugin version
 * @param {boolean} props.isPremium - Is plugin premium
 * @param {array} props.options - Plugin Options
 * @param {logo} props.logo - Plugin Logo
 *
 * @return {React.Component} Admin component
 */

const Admin = (props) => {
	// const {title, features=[], version, isPremium, options=[],logo='' } = props;

	return <HashRouter>
		<App {...props} />
	</HashRouter>
}
export default Admin;