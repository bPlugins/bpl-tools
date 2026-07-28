import { checkIcon } from '../../utils/icons';

/**
 * Card selector — pick one of N options.
 *
 * @param {object}   props
 * @param {string}   props.id       - Field id; becomes the saved option key
 * @param {object[]} props.options  - [{value, label, icon?, description?, condition?}]
 * @param {string}   props.value    - Currently selected value
 * @param {object}   props.values   - All wizard values, for evaluating `condition`
 * @param {Function} props.onChange - Called with the new value
 */
const ChoiceCards = ({ id, options = [], value, values = {}, onChange }) => {
	const visible = options.filter(option => 'function' !== typeof option.condition || option.condition(values));

	if (!visible.length) {
		return null;
	}

	return <div className='bPlOnboardingChoices' role='radiogroup' aria-labelledby={`${id}-label`}>
		{visible.map(option => {
			const isSelected = value === option.value;

			return <button
				key={option.value}
				type='button'
				role='radio'
				aria-checked={isSelected}
				className={`choiceCard ${isSelected ? 'selected' : ''}`}
				onClick={() => onChange(option.value)}
			>
				{option.icon && <span className='choiceIcon'>{option.icon}</span>}

				<span className='choiceBody'>
					<span className='choiceLabel'>{option.label}</span>
					{option.description && <span className='choiceDescription'>{option.description}</span>}
				</span>

				<span className='choiceCheck' aria-hidden='true'>{checkIcon}</span>
			</button>;
		})}
	</div>;
};
export default ChoiceCards;
