import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

import './style.css';

export const Device = compose(
	withSelect((select) => {
		const { __experimentalGetPreviewDeviceType } = select('core/edit-post');

		return {
			device: __experimentalGetPreviewDeviceType()?.toLowerCase(),
		};
	}),
	withDispatch((dispatch) => {
		return {
			setDevice(device) {
				return dispatch('core/edit-post').__experimentalSetPreviewDeviceType(device);
			},
		};
	})
)(
	({ style, className, position = 'horizontal', device, setDevice, onChange = () => { }, }) => {
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
);
