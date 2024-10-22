import { useEffect, useRef, useState } from 'react';
import { Popover } from '@wordpress/components';

import "./PanelSelectControl.scss";

const PanelSelectControl = ({ value = [], options, onChange = () => { }, className }) => {
	const [visible, setVisible] = useState(false);
	const refHeadingTag = useRef();
	const [newValue, setValue] = useState(value);
	const addValue = (option) => {
		const restVal = [...newValue];
		if (!restVal.includes(option)) {
			restVal.push(option);
			setValue(restVal);
		}
	};
	useEffect(() => {
		const handle = (e) => {
			if (!refHeadingTag?.current?.contains(e.target)) {
				setVisible(false);
			}
		};
		document.addEventListener('mousedown', handle);
		return () => {
			document.removeEventListener('mousedown', handle);
		};
	});
	useEffect(() => {
		onChange(newValue);
	}, [newValue]);
	return (
		<div className={className}>
			<ul className="anchor-list-admin-panel">
				{newValue &&
					newValue.map((val, idx) => (
						<li key={idx} className="anchor-admin-panel-list">
							<svg stroke="currentColor" className="deleteIcon"
								onClick={() =>
									setValue(newValue.filter((val, i) => i !== idx))
								} fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path></svg>
							{val}
						</li>
					))}
				{value && value.length < options.length && (
					<li
						onClick={() => setVisible(!visible)}
						className="anchor-admin-panel-list-plus-icon"
					>
						<svg stroke="currentColor" className="squirePlusIcon" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"></path></svg>
					</li>
				)}
				<input
					onClick={() => setVisible(!visible)}
					type="search"
					autoCorrect="off"
					autoCapitalize="off"
				/>
			</ul>
			{visible && (
				<Popover ref={refHeadingTag} className="popover-anchor-admin-panel">
					{options.map((option, idx) => (
						<p
							key={idx}
							onClick={() => addValue(option)}
							className={`${newValue.includes(option) ? 'isActiveTag' : ''}`}
						>
							{option}
						</p>
					))}
				</Popover>
			)}
		</div>
	);
};
export default PanelSelectControl;