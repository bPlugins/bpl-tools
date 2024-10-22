import { useRef, useEffect, useState } from 'react';
import { Popover, Dashicon } from '@wordpress/components';
import { produce } from 'immer';

import './MultiSelectControl.scss';

const MultiSelectControl = ({ value = [], onChange, limit = 10, options = [] }) => {
	const [isPopover, setIsPopover] = useState(false)
	const popoverRef = useRef()

	const addItem = (item) => {
		onChange(produce(value, (draft) => {
			if (!draft.includes(item)) {
				draft.push(item);
			}
		}));
		setIsPopover(false);
	};

	useEffect(() => {
		const handle = (e) => {
			if (!popoverRef?.current?.contains(e.target)) {
				setIsPopover(false)
			}
		}
		document.addEventListener('mousedown', handle)
		return () => {
			document.removeEventListener('mousedown', handle)
		}
	});

	return <div className='bPlMultiSelect'>
		<ul className="listWrap">
			{value.length ? value.map((val, idx) => {
				const selectedItem = options.find(opt => opt.value === val);

				return <li key={idx} className="valueItem">
					{selectedItem.label}
					<Dashicon onClick={() => onChange(value.filter((__, i) => i !== idx))} icon="no-alt" />
				</li>
			}) : ''}

			{value.length < limit && <>
				<li onClick={() => setIsPopover(true)} className="plusIcon">
					<Dashicon icon="plus" />
				</li>

				<input
					onClick={() => setIsPopover(true)}
					type="search"
					autoCorrect="off"
					autoCapitalize="off"
				/>
			</>}
		</ul>

		{isPopover && <Popover ref={popoverRef} className="bPlItemsPopover">
			{options.map(option => {
				const { label, value: val } = option;

				return <p key={val} onClick={() => addItem(val)} className={`${value.includes(val) ? 'activeItem' : ''}`}>{label}</p>
			})}
		</Popover>}
	</div>;
};
export default MultiSelectControl;