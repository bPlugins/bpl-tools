import { demoIcon, docsIcon } from '../../utils/icons';

const Block = ({ block, isPremium, disableBlockName, handleCheckboxChange, isSaving, isLinks = true }) => {
	const { name, title, icon, demo, docs, badge = '', required = false } = block;
	const isBlockPremium = !isPremium && block.isPremium;
	const disabledBlock = isBlockPremium ? false : !disableBlockName.includes(name);
	const isRequired = required === true;

	return <div className={`block ${!disabledBlock ? 'disabled' : ''}`}>
		<div className='icon'>{icon}</div>

		<div className='name'>
			<p className='blockTitle'>{title}</p>{isBlockPremium && <a href='#pricing'>Get Pro</a>}
		</div>

		{isLinks && <>
			{demo && <a className='actionBtn' href={demo} target='_blank' rel='noopener noreferrer'>
				{demoIcon}
			</a>}

			{docs && <a className='actionBtn' href={docs} target='_blank' rel='noopener noreferrer'>
				{docsIcon}
			</a>}
		</>}

		{badge && <p className='blockBadge'>{badge}</p>}

		{isBlockPremium && <p className='blockBadge blockProBadge'>Pro</p>}

		{isRequired && <p className='blockBadge blockRequiredBadge'>Required</p>}

		<label className='toggleSwitch' {...((isBlockPremium || isRequired) ? { htmlFor: 'b-blocks-admin-pro-modal-toggle' } : {})}>
			<input
				type='checkbox'
				checked={disabledBlock}
				{...(isBlockPremium || isRequired ? {} : { onChange: (e) => handleCheckboxChange(name, e.target.checked) })}
				disabled={isSaving || isBlockPremium || isRequired}
			/>
			<span className='slider'></span>
		</label>
	</div>;
};
export default Block;