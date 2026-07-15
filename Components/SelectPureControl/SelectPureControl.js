/**
	* SelectPureControl Component
	*
	* @props className (optional): '' (String)
	* @props label (optional): '' (String)
	* @props value (required): Selected option value(s) (String|Array)
	* @props onChange (required): (Function)
	* @props options (optional): [] Available options (Array)
	*/

import { useEffect, useRef } from 'react';
import SelectPure from 'select-pure';

import './SelectPureControl.scss';
import Label from '../Label/Label';

const SelectPureControl = props => {
	const { className = '', label = '', value, onChange, options = [] } = props;

	const selectPureEl = useRef(null);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	useEffect(() => {
		if (selectPureEl.current) {
			selectPureEl.current.innerHTML = '';
			new SelectPure(selectPureEl.current, {
				value,
				onChange: val => onChangeRef.current(val),
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
	}, [JSON.stringify(value), JSON.stringify(options)]);

	return label ? <div className={className}>
		<Label className='mb5'>{label}</Label>

		<div ref={selectPureEl}></div>
	</div> : <div className={className} ref={selectPureEl}></div>;
};
export default SelectPureControl;