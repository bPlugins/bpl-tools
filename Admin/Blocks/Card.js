import { useEffect, useState } from 'react';

import './card.scss';

import Block from './Block';
import Toast from './Toast';

const BlocksCard = (props) => {
	const { isPremium, disabledBlocks, onChange, allBlocks, status, ProModal = null } = props;
	const publishedBlocks = allBlocks.filter(b => 'published' === b.status || !b.status);

	const [isSaving, setIsSaving] = useState(false);
	const [disableBlockName, setDisableBlockName] = useState(disabledBlocks || []);
	const [toast, setToast] = useState(null);

	// Update toast based on status prop
	useEffect(() => {
		if (status === 'loading') {
			setToast({ message: 'Loading blocks...', type: 'loading' });
			setIsSaving(true);
		} else if (status === 'success') {
			setToast({ message: 'Blocks saved successfully!', type: 'success' });
			setIsSaving(false);
			setTimeout(() => setToast(null), 3000);
		} else if (status === 'error') {
			setToast({ message: 'Failed to save blocks', type: 'error' });
			setIsSaving(false);
			setTimeout(() => setToast(null), 3000);
		}
	}, [status]);

	const handleCheckboxChange = (blockName, isChecked) => {
		const updatedBlocksName = isChecked ?
			disableBlockName.filter((name) => name !== blockName) :
			[...disableBlockName, blockName];

		setDisableBlockName(updatedBlocksName);
		onChange?.(updatedBlocksName);
		setToast({ message: 'Saving changes...', type: 'loading' });
		setIsSaving(true);
	};

	return publishedBlocks?.length && <div className='bPlDashboardBlocksCard bPlDashboardCard'>
		{!isPremium && ProModal && <ProModal />}

		{toast && <Toast message={toast.message} type={toast.type} />}

		<div className='blocksCardHeader'>
			<h3>Blocks</h3>

			<a href="#blocks">View All</a>
		</div>

		{publishedBlocks.length > 0 && (
			<div className='dashboardBlocks'>
				{publishedBlocks?.slice(0, 9)?.map(block => (
					<Block
						key={block.name}
						block={block}
						isPremium={isPremium}
						disableBlockName={disableBlockName}
						handleCheckboxChange={handleCheckboxChange}
						isSaving={isSaving}
						isLinks={false}
					/>
				))}
			</div>
		)}
	</div>
};
export default BlocksCard;
