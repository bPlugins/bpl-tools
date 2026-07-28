/**
 * On/off switch.
 *
 * @param {object}   props
 * @param {string}   props.id       - Field id; becomes the saved option key
 * @param {boolean}  props.value    - Current state
 * @param {Function} props.onChange - Called with the new boolean
 */
const ToggleField = ({ id, value, onChange }) => <button
	type='button'
	id={id}
	role='switch'
	aria-checked={!!value}
	className={`bPlOnboardingToggle ${value ? 'on' : ''}`}
	onClick={() => onChange(!value)}
>
	<span className='toggleKnob' aria-hidden='true' />
</button>;
export default ToggleField;
