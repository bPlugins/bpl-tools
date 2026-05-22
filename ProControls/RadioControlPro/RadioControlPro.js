import { Flex, RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Label from "../../Components/Label/Label";
import "./RadioControlPro.scss";
const prefix = "radioControl"
const RadioControlPro = ({ label, onChange, className, isPremium = false, setIsProModalOpen, gap = "130px", direction = 'row', ...restProps }) => {
	const labelMiddleWare = (label) => isPremium ? label : <div className={`${prefix}labelContainer`}>
		<span className={`${prefix}bplOpacity75`}>{label}</span> <span className={`${prefix}labelPro`}>{__('Pro')}</span>
	</div>
	return <Flex align='start' direction={direction} gap={gap} className={`${prefix}RadioControlPro ${className}`}>
		<Label>{labelMiddleWare(label)}</Label>
		<RadioControl
			className={`${className} ${isPremium ? '' : 'bplProIdentifier'}`}
			label=""
			onChange={(val) => isPremium ? onChange(val) : setIsProModalOpen(true)}
			isPremium={isPremium}
			{...restProps}
		/>
	</Flex>
};

export default RadioControlPro;