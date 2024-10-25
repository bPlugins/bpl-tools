import Dimension from './Dimension';
import Background from './Background';
import BorderShadow from './BorderShadow';
import Animation from './Animation';
import Visibility from './Visibility';
import Responsive from './Responsive';
import CustomCSS from './CustomCSS';
import { updateData } from '../utils/functions';

const defEnabled = {
	dimension: ['padding', 'margin'],
	background: ['normal', 'hover', 'overlay'],
	borderShadow: ['normal', 'hover', 'border', 'shadow'],
	animation: true,
	visibility: ['zIndex', 'overflow'],
	responsive: true,
	css: true
}

const Advanced = ({ advanced, onChange, enabled = defEnabled, id = null, isPremium = false }) => {
	const { dimension = {}, background = {}, borderShadow = {}, animation = {}, visibility = {}, responsive = {}, css = '' } = advanced || {};

	const isEnabled = (which) => Object.prototype.hasOwnProperty.call(enabled, which);

	return <>
		{isEnabled('dimension') && <Dimension dimension={dimension} onChange={val => onChange(updateData(advanced, val, 'dimension'))} enabled={enabled.dimension} />}

		{isEnabled('background') && <Background background={background} onChange={val => onChange(updateData(advanced, val, 'background'))} enabled={enabled.background} isPremium={isPremium} />}

		{isEnabled('borderShadow') && (enabled.borderShadow?.includes('border') || enabled.borderShadow?.includes('shadow')) && <BorderShadow borderShadow={borderShadow} onChange={val => onChange(updateData(advanced, val, 'borderShadow'))} enabled={enabled.borderShadow} />}

		{isEnabled('animation') && <Animation animation={animation} onChange={val => onChange(updateData(advanced, val, 'animation'))} id={id} isPremium={isPremium} />}

		{isEnabled('visibility') && <Visibility visibility={visibility} onChange={val => onChange(updateData(advanced, val, 'visibility'))} enabled={enabled.visibility} />}

		{isEnabled('responsive') && <Responsive responsive={responsive} onChange={val => onChange(updateData(advanced, val, 'responsive'))} />}

		{isEnabled('css') && <CustomCSS css={css} onChange={val => onChange(updateData(advanced, val, 'css'))} />}
	</>
}
export default Advanced;