import { Spinner } from '@wordpress/components';

const Toast = ({ message, type }) => {
    return <div className={`bPlDashboardBlocksToast dashboardBlocksToast-${type}`}>
        {type === 'loading' && <Spinner />}
        {type === 'success' && <span className='checkmark'>✓</span>}
        {type === 'error' && <span className='error-icon'>✕</span>}
        <span className='message'>{message}</span>
    </div>;
};
export default Toast;