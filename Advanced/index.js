import Mask from '../Components/Mask/Mask';
import { updateData } from '../utils/functions';
import Animation from './Animation';
import Background from './Background';
import BorderShadow from './BorderShadow';
import CustomCSS from './CustomCSS';
import Dimension from './Dimension';
import Responsive from './Responsive';
import Transform from './Transform';
import Visibility from './Visibility';

const defEnabled = {
	dimension: ['padding', 'margin'],
	transform: true,
	background: ['normal', 'hover', 'overlay'],
	borderShadow: ['normal', 'hover', 'border', 'shadow'],
	mask: true,
	animation: true,
	visibility: ['zIndex', 'overflow'],
	responsive: true,
	css: true
}

const Advanced = ({ advanced, onChange, enabled = defEnabled, id = null, isPremium = false }) => {
	const { dimension = {}, transform = {}, background = {}, borderShadow = {}, mask = {}, animation = {}, visibility = {}, responsive = {}, css = '' } = advanced || {};

	const isEnabled = (which) => Object.prototype.hasOwnProperty.call(enabled, which);

	return <>
		{isEnabled('dimension') && <Dimension dimension={dimension} onChange={val => onChange(updateData(advanced, val, 'dimension'))} enabled={enabled.dimension} />}

		{(isEnabled("transform") && isPremium) && <Transform transform={transform} onChange={val => onChange(updateData(advanced, val, "transform"))} />}

		{isEnabled('background') && <Background background={background} onChange={val => onChange(updateData(advanced, val, 'background'))} enabled={enabled.background} isPremium={isPremium} />}

		{isEnabled('borderShadow') && (enabled.borderShadow?.includes('border') || enabled.borderShadow?.includes('shadow')) && <BorderShadow borderShadow={borderShadow} onChange={val => onChange(updateData(advanced, val, 'borderShadow'))} enabled={enabled.borderShadow} />}

		{(isEnabled("mask") && isPremium) && <Mask mask={mask} onChange={val => onChange(updateData(advanced, val, "mask"))} />}

		{isEnabled('animation') && <Animation animation={animation} onChange={val => onChange(updateData(advanced, val, 'animation'))} id={id} isPremium={isPremium} />}

		{isEnabled('visibility') && <Visibility visibility={visibility} onChange={val => onChange(updateData(advanced, val, 'visibility'))} enabled={enabled.visibility} />}

		{isEnabled('responsive') && <Responsive responsive={responsive} onChange={val => onChange(updateData(advanced, val, 'responsive'))} />}

		{isEnabled('css') && <CustomCSS css={css} onChange={val => onChange(updateData(advanced, val, 'css'))} />}
	</>
}
export default Advanced;