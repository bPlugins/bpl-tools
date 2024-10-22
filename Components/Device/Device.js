import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

import './style.css';

const Device = ({ style, className, position = 'horizontal', device, setDevice, onChange = () => { }, }) => {
	const deviceValue = [
		{ label: 'Desktop', name: 'desktop', icon: 'dashicons-desktop' },
		{ label: 'Tablet', name: 'tablet', icon: 'dashicons-tablet' },
		{ label: 'Mobile', name: 'mobile', icon: 'dashicons-smartphone' },
	];

	return <div className={className} style={style} >
		<div style={{ display: position === 'horizontal' ? 'flex' : 'grid', gap: '5px', }} >
			{deviceValue.map(({ label, name, icon }, i) => (
				<button
					key={i}
					className={`advancedOptionssingle-device ${name === device ? 'active' : ''}`}
					onClick={() => {
						setDevice(label);
						onChange(label.toLowerCase());
					}}
				>
					<span className={`dashicons ${icon} ${name === device ? 'active' : ''} `} />
				</button>
			))}
		</div>
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