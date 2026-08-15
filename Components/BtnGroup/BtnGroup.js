/**
 * Button Group Component
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class for styling (e.g. 'mt20')
 * @param {string} [props.label=''] - Label text to display above the button group
 * @param {string} [props.labelPosition='left'] - Layout position of the label
 * @param {string} props.value - Currently selected button value
 * @param {string} [props.defaultValue=''] - Value passed to onChange when the already selected button is clicked again
 * @param {Function} props.onChange - Callback function when button selection changes
 * Receives (value, default) as parameters
 * @param {Object[]} props.options - Array of button options
 * @param {string} props.options[].value - Unique value for the button
 * @param {string} props.options[].label - Display text for the button
 * @param {string} [props.options[].icon] - Icon for the button (when isIcon is true)
 * @param {string} [props.options[].def] - Default value passed to onChange
 * @param {boolean} [props.isIcon=false] - Whether to show icons instead of text
 * @param {boolean} [props.isTextIcon=false] - Whether to show icon as text
 * @param {string} [props.size='compact'] - Button size ('compact' | 'small' | 'default')
 * @returns {JSX.Element} Button Group component
 */

import { Button, ButtonGroup, PanelRow } from '@wordpress/components';

import Label from '../Label/Label';

const BtnGroup = props => {
	const { className, label = '', labelPosition = 'left', value, defaultValue = '', onChange, options, isIcon = false, isTextIcon = false, size = 'compact' } = props;

	const Buttons = ({ className = '' }) => <ButtonGroup className={`bPlBtnGroup ${className || null}`}>
		{Object.values(options).map(obj => {
			const { value: val, icon = '', label = '', def = '' } = obj;
			const isActive = value === val;

			return <Button key={val} value={val} label={label} showTooltip={true} tooltipPosition='top'
				icon={isIcon ? icon : null}
				variant={isActive ? 'primary' : ''}
				aria-pressed={isActive}
				size={size}
				onClick={() => onChange(isActive ? defaultValue : val, def && def)}
			>{isTextIcon ? icon : isIcon ? '' : label}</Button>
		})}
	</ButtonGroup>

	return label ?
		('left' === labelPosition ? <PanelRow className={className}>
			<Label className=''>{label}</Label>

			<Buttons />
		</PanelRow> : <>
			<Label>{label}</Label>

			<Buttons className={className} />
		</>) :
		<Buttons className={className} />
}
export default BtnGroup;