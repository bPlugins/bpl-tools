import { useEffect, useRef, useState } from 'react';
import { Button, Flex, Popover, Tooltip } from '@wordpress/components';

import Label from '../Label/Label';
import { isExist } from '../../utils/functions';

const CustomPopover = ({ icon, btnText, children, value, label, resetValues = {}, onClick = () => { } }) => {
	const [visible, setVisible] = useState(false);
	const popOverRef = useRef(null);
	const btnRef = useRef(null);

	const isShowResetBtn = isExist(value) && isExist(resetValues) && JSON.stringify(value) !== JSON.stringify(resetValues);

	useEffect(() => {
		const handle = (e) => {
			if (
				!btnRef?.current?.contains(e.target) &&
				!popOverRef?.current?.contains(e.target)
			) {
				setVisible(false);
			}
		}

		document.addEventListener('mousedown', handle);

		return () => {
			document.removeEventListener('mousedown', handle);
		}
	});
	return <div className='bPlCustomPopoverWrapper'>
		{label && <Label className=''>{label}</Label>}

		<div>
			<Flex>
				{isShowResetBtn ?
					<Tooltip text='Back to default' delay={100} position='top center' placement='top'>
						<Button icon='image-rotate' onClick={() => onClick(resetValues)} />
					</Tooltip> :
					''}

				<Button icon={icon} ref={btnRef} isSecondary onClick={() => setVisible(!visible)}>{btnText}</Button>
			</Flex>

			{visible && <Popover ref={popOverRef} onMouseOver={() => setVisible(true)}>
				<div className='bPlCustomPopoverChildren'>{children}</div>
			</Popover>}
		</div>
	</div>
}
export default CustomPopover;