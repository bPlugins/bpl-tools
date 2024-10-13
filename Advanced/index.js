import Dimension from './Dimension';
import Background from './Background';
import { updateData } from '../utils/functions';

const defEnabled = {
	dimension: ['padding', 'margin'],
	background: ['normal', 'hover']
}

const Advanced = ({ advanced, onChange, enabled = defEnabled }) => {
	const { dimension, background } = advanced || {};

	const isEnabled = (which) => Object.prototype.hasOwnProperty.call(enabled, which);

	return <>
		{isEnabled('dimension') && <Dimension dimension={dimension} onChange={val => {
			console.log(val);
			onChange(updateData(advanced, val, 'dimension'))
		}} enabled={enabled.dimension} />}

		{isEnabled('background') && <Background background={background} onChange={val => onChange(updateData(advanced, val, 'background'))} enabled={enabled.background} />}
	</>
}
export default Advanced;