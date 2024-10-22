/**
 * @props className (optional): 'mt20' (String)
 * @props value: selectedOptions (Array)
 * @props onChange: (Function)
 * @props defaults (optional): { width, height, style, color } (Array)
 * @return Separator Properties (Object)
 */

import { useEffect, useRef } from 'react';
import SelectPure from 'select-pure';

import './SelectPureControl.scss';
import { Label } from '../index';

const SelectPureControl = props => {
	const { className = '', label = '', value, onChange, options = [] } = props;

	const selectPureEl = useRef(null);

	useEffect(() => {
		if (selectPureEl.current) {
			selectPureEl.current.innerHTML = '';
			new SelectPure(selectPureEl.current, {
				value,
				onChange: val => onChange(val),
				options,
				multiple: true,
				autocomplete: true,
				icon: 'closeIcon',
				classNames: {
					select: 'bplSelectPure',
					multiselect: 'selectMultiple',
					label: 'selectLabel',
					selectedLabel: 'selectSelectedLabel',
					dropdown: 'selectOptions',
					dropdownShown: 'selectOptionsOpened',
					autocompleteInput: 'selectAutocomplete',
					option: 'selectOption',
					selectedOption: 'selectOptionSelected',
					optionDisabled: 'selectOptionDisabled',
					optionHidden: 'selectOptionHidden',
					placeholder: 'selectPlaceholder',
					placeholderHidden: 'selectPlaceholderHidden'
				}
			});
		}
	}, [selectPureEl]);

	return label ? <div className={className}>
		<Label className='mb5'>{label}</Label>

		<div ref={selectPureEl}></div>
	</div> : <div className={className} ref={selectPureEl}></div>;
};
export default SelectPureControl;