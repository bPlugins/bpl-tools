import { useRef, useEffect } from 'react';
import { SelectControl } from '@wordpress/components';

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