/**
 * @props className (optional): 'mt20' (String)
 * @props value (String)
 * @props onChange: (Function)
 * @return Value (String)
 */

import { PanelRow, Button, ButtonGroup } from '@wordpress/components';

import './BtnGroupPro.scss';
import { Label } from '../../Components';

const BtnGroupPro = props => {
	const { className, label, value, onChange, options, isIcon = false, isTextIcon = false, size, isPremium = false, setIsProModalOpen = () => { }, proValues } = props;
	const newOptions = options.map(o => ({ ...o, className: (proValues?.includes(o.value) && !isPremium) ? 'bplProGroupBtn' : '' }));

	const Buttons = ({ className = '' }) => <ButtonGroup className={`bPlBtnGroup ${className || null}`}>
		{newOptions?.map(obj => {
			const { className = '', value: val, icon = '', label = '', def = '' } = obj;
			const isActive = value === val;
			const isSm = size === 'small';

			return <Button
				key={val}
				className={className}
				label={label}
				showTooltip={true}
				tooltipPosition='top'
				icon={isIcon ? icon : null}
				variant={isActive ? 'primary' : ''}
				aria-pressed={isActive}
				isSmall={isSm}
				isMedium={!isSm}
				onClick={() => isPremium ? onChange(val, def && def) : (proValues?.includes(val) ? setIsProModalOpen(true) : onChange(val, def && def))}
			>{isTextIcon ? icon : isIcon ? '' : label}</Button>
		})}
	</ButtonGroup>

	return label ? <PanelRow className={className}>
		<Label className=''>{label}</Label>

		<Buttons />
	</PanelRow> : <Buttons className={className} />
};
export default BtnGroupPro;