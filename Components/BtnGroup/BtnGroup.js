/**
 * @props className (optional): 'mt20' (String)
 * @props value (String)
 * @props onChange: (Function)
 * @return Value (String)
 */

import { PanelRow, Button, ButtonGroup } from '@wordpress/components';

import { Label } from '../index';

const BtnGroup = props => {
	const { className, label = '', value, onChange, options, isIcon = false, isTextIcon = false, size } = props;

	const Buttons = ({ className = '' }) => <ButtonGroup className={`bPlBtnGroup ${className || null}`}>
		{Object.values(options).map(obj => {
			const { value: val, icon = '', label = '', def = '' } = obj;
			const isActive = value === val;
			const isSm = size === 'small';

			return <Button key={val} label={label} showTooltip={true} tooltipPosition='top'
				icon={isIcon ? icon : null}
				variant={isActive ? 'primary' : ''}
				aria-pressed={isActive}
				isSmall={isSm}
				isMedium={!isSm}
				onClick={() => onChange(val, def && def)}
			>{isTextIcon ? icon : isIcon ? '' : label}</Button>
		})}
	</ButtonGroup>

	return label ? <PanelRow className={className}>
		<Label className=''>{label}</Label>

		<Buttons />
	</PanelRow> : <Buttons className={className} />
};
export default BtnGroup;