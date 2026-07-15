/**
	* Toast Component
	*
	* @props message (required): text to display in the toast (String)
	* @props type (required): toast type ('loading'|'success'|'error') (String)
	*/

import { Spinner } from '@wordpress/components';

const Toast = ({ message, type }) => {
	return <div className={`bPlDashboardBlocksToast ${type}`}>
		{type === 'loading' && <Spinner />}
		{type === 'success' && <span className='checkmark'>✓</span>}
		{type === 'error' && <span className='error-icon'>✕</span>}
		<span className='message'>{message}</span>
	</div>;
};
export default Toast;