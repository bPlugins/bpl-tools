/**
 * Notice Component
 * 
 * @props className (optional): 'mt10' (String)
 * @props status (optional): 'info' | 'success' | 'warning' | 'danger' | 'premium' (String)
 * @props isIcon (optional): false (Boolean)
 * @props children (required): (Node)
 */

import { crownIcon } from '../../utils/icons';
import './style.scss';

const Notice = ({ className = 'mt10', status = 'info', isIcon = false, children }) => {
	const icons = {
		info: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<circle cx='12' cy='12' r='10' /><line x1='12' y1='16' x2='12' y2='12' /><line x1='12' y1='8' x2='12.01' y2='8' />
		</svg>,
		success: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' /><polyline points='22 4 12 14.01 9 11.01' />
		</svg>,
		warning: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' /><line x1='12' y1='9' x2='12' y2='13' /><line x1='12' y1='17' x2='12.01' y2='17' />
		</svg>,
		danger: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<circle cx='12' cy='12' r='10' /><line x1='12' y1='8' x2='12' y2='12' /><line x1='12' y1='16' x2='12.01' y2='16' />
		</svg>,
		premium: crownIcon
	};

	return <div className={`bPlNotice ${status} ${className}`}>
		{isIcon && <div className='icon'>
			{icons[status] || icons.info}
		</div>}

		<span>
			{children}
		</span>
	</div>
};
export default Notice;