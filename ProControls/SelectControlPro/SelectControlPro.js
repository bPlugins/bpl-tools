/**
	* SelectControlPro Component
	*
	* @props className (optional): Additional CSS classes (String)
	* @props onChange (required): Change handler invoked for allowed selections (Function)
	* @props isPremium (optional): false (Boolean)
	* @props setIsProModalOpen (optional): () => {} Opens the pro modal for gated values (Function)
	* @props options (optional): [] Select options (Array)
	* @props proValues (optional): [] Option values that require pro access (Array)
	*/

import { SelectControl } from '@wordpress/components';
import { useEffect, useRef } from 'react';

import './SelectControlPro.scss';

const SelectControlPro = ({ className, onChange, isPremium = false, setIsProModalOpen = () => { }, options = [], proValues = [], ...restProps }) => {
	const newOptions = options.map(o => ({ ...o, label: (proValues?.includes(o.value) && !isPremium) ? `${o.label} - Pro` : o.label }));

	const selectRef = useRef(null);

	useEffect(() => {
		const selectEl = selectRef?.current;

		if (selectEl && !isPremium) {
			const optEls = selectEl?.childNodes;

			optEls?.forEach(optEl => {
				if (proValues?.includes(optEl.value)) {
					optEl.classList.add('proOption');
				}
			});
		}
	}, [selectRef, proValues]);

	return <SelectControl ref={selectRef}
		className={`${className} ${isPremium ? '' : 'bplPorSelect'}`}
		onChange={(val) => isPremium ? onChange(val) : (proValues?.includes(val) ? setIsProModalOpen(true) : onChange(val))}
		options={newOptions}
		{...restProps}
	/>
}
export default SelectControlPro;