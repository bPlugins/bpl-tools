import ChoiceCards from './ChoiceCards';
import ColorField from './ColorField';
import ToggleField from './ToggleField';
import HelpModal from './HelpModal';

const CONTROLS = {
	choice: ChoiceCards,
	color: ColorField,
	toggle: ToggleField
};

/**
 * Renders one field row: label, description, and the control for its type.
 *
 * `choice` gets a stacked layout (label above full-width cards); `color` and
 * `toggle` sit inline on the right of their label.
 *
 * @param {object}   props
 * @param {object}   props.field    - {type, id, label, description?, help?, options?, default?, condition?}
 * @param {object}   props.values   - All wizard values
 * @param {Function} props.onChange - Called with (id, value)
 */
const Field = ({ field, values = {}, onChange }) => {
	const Control = CONTROLS[field.type];

	if (!Control) {
		return null;
	}

	if ('function' === typeof field.condition && !field.condition(values)) {
		return null;
	}

	const value = undefined === values[field.id] ? field.default : values[field.id];
	const isStacked = 'choice' === field.type;

	return <div className={`bPlOnboardingField ${isStacked ? 'stacked' : 'inline'}`}>
		<div className='fieldText'>
			{field.label && <span className='fieldLabel' id={`${field.id}-label`}>
				{field.label}
				{field.help && <HelpModal help={field.help} label={field.label} />}
			</span>}
			{field.description && <span className='fieldDescription'>{field.description}</span>}
		</div>

		<div className='fieldControl'>
			<Control
				{...field}
				value={value}
				values={values}
				onChange={next => onChange(field.id, next)}
			/>
		</div>
	</div>;
};

export { ChoiceCards, ColorField, ToggleField, HelpModal };
export default Field;
