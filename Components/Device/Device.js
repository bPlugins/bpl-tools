import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

import './style.scss';

const Device = ({ style, className, position = 'horizontal', device, setDevice, onChange = () => { }, }) => {
	const deviceValue = [
		{ label: 'Desktop', name: 'desktop', icon: 'dashicons-desktop' },
		{ label: 'Tablet', name: 'tablet', icon: 'dashicons-tablet' },
		{ label: 'Mobile', name: 'mobile', icon: 'dashicons-smartphone' },
	];

	return <div className={`bPlDeviceControl ${className}`} style={{ ...{ display: position === 'horizontal' ? 'flex' : 'grid' }, ...style }}>
		{deviceValue.map(({ label, name, icon }, i) => (
			<button
				key={i}
				className={name === device ? 'active' : ''}
				onClick={() => {
					setDevice(label);
					onChange(label.toLowerCase());
				}}
			>
				<span className={`dashicons ${icon} ${name === device ? 'active' : ''} `} />
			</button>
		))}
	</div>
}
export default compose(
	withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase(),
		};
	}),

	withDispatch((dispatch) => {
		return {
			setDevice(device) {
				return dispatch('core/editor').setDeviceType(device);
			},
		};
	})
)(Device);