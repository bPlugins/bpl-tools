/**
	* BButtonGroup Component
	*
	* @props className (optional): '' (String)
	* @props label (optional): 'Button Group' (String)
	* @props options (required): Array of { value, label } options (Array)
	* @props value (required): Currently selected value (String)
	* @props onChange (optional): (Function)
	* @props borderRadius (optional): '30px' (String)
	* @props height (optional): (String)
	* @props paddingX (optional): '8px' (String)
	* @props paddingY (optional): '4px' (String)
	* @props fontSize (optional): '12px' (String)
	* @props fontWeight (optional): 400 (Number)
	* @props activeBg (optional): Active button background (String)
	* @props activeColor (optional): '#fff' (String)
	* @props inactiveColor (optional): '#000' (String)
	* @props hoverBg (optional): Hover background (String)
	* @props hoverColor (optional): Hover color (String)
	* @props style (optional): Inline style object (Object)
	*/

import { useEffect, useRef, useState } from 'react';

import { primaryColor } from '../../utils/data';

const BButtonGroup = (props) => {
	const { className = '', options = [], label = 'Button Group', value, defaultValue = '', onChange = () => { }, borderRadius = '30px', height, paddingX = '8px', paddingY = '4px', fontSize = '12px', fontWeight = 400, activeBg, activeColor = '#fff', inactiveColor = '#000', hoverBg, hoverColor, style, } = props;
	const [activeButton, setActiveButton] = useState(0);

	const btnOptions = options.length > 0 ? options : [1, 2];

	const btnRef = useRef(null);
	const bgSlideRef = useRef(null);
	const uniqId = Math.floor(Math.random() * 99999999);
	useEffect(() => {
		const activeIndex = activeButton > options.length - 1 ? activeButton - 1 : activeButton
		const btnWrapper = btnRef.current;
		const bdSlide = bgSlideRef.current;
		if (value) {
			btnOptions.forEach((v, i) => {
				if (v.value === value) {
					setActiveButton(i);
				}
			});
		}

		const btns = btnWrapper.querySelectorAll(`.bpl-button-group-${uniqId}`);
		const singleBtn = Array.from(btns)[activeIndex];
		// const leftValue = Array.from(btns)[activeButton === 0 ? activeButton : activeButton - 1].getBoundingClientRect().width.toFixed(2)
		const boundingHeight = singleBtn.getBoundingClientRect().height.toFixed(2);
		const boundingWidth = singleBtn.getBoundingClientRect().width.toFixed(2);
		const width = Number(boundingWidth);
		const height = Number(boundingHeight);

		bdSlide.style.width = `${width || singleBtn.clientWidth}px`;
		bdSlide.style.height = `${height || singleBtn.clientHeight}px`;
		// bdSlide.style.left = `${activeButton * leftValue}px`;
		bdSlide.style.left = `${singleBtn.offsetLeft}px`;
	}, [activeButton, options, value]);

	const handleSetValue = (e, option, i) => {
		const newValue = value === option.value ? defaultValue : option.value;
		const newIndex = btnOptions.findIndex(v => v.value === newValue);

		setActiveButton(newIndex > -1 ? newIndex : i);
		onChange(newValue);
	}

	return <div className={className} style={{ marginBottom: '10px', ...style }}>
		<style>{`
				.bpl-buttonGroupHover-${uniqId}.bpl-button-group-${uniqId}:hover{
					background:${hoverBg};
					color:${hoverColor};
					transition: background 0.3s ease-in-out;
				}
			`}</style>

		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}			>
			{label && <label style={{ fontWeight: 500 }}>{label}</label>}

			<div ref={btnRef} style={{ display: 'flex', position: 'relative', border: '1px solid #ccc', borderRadius }}>
				{btnOptions.map((option, i) => <button
					style={{
						background: hoverBg ? activeButton === i ? 'transparent' : '' : 'transparent',
						borderRadius,
						height,
						padding: `${paddingY} ${paddingX}`,
						fontSize,
						zIndex: 20,
						cursor: 'pointer',
						fontWeight,
						color: `${activeButton !== i ? inactiveColor : activeColor}`,
						border: 'none'
					}}

					key={i}
					onClick={(e) => handleSetValue(e, option, i)}
					className={`${activeButton !== i ? `bpl-buttonGroupHover-${uniqId}` : ''} bpl-button-group-${uniqId}`}
				>
					{options.length ? option.label : `Button ${(i + 1)}`}
				</button>)}

				<div ref={bgSlideRef} style={{ background: activeBg || primaryColor, transition: 'left 0.2s ease-in-out', position: 'absolute', top: 0, left: 0, zIndex: 10, borderRadius }} />
			</div>
		</div>
	</div>
}

export default BButtonGroup;