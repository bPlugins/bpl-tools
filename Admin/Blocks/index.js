
import { useState, useEffect } from 'react';

import './style.scss';

import Button from '../../Components/Button/Button';
import { closeIcon, searchIcon } from '../../utils/icons';

import Block from './Block';
import Toast from './Toast';

/**
 * Blocks Component
 * Renders a management interface for enabling/disabling plugin features/blocks.
 * Includes search, categorization, and "Activate/Deactivate All" functionality.
 *
 * @param {object} props - Component props
 * @param {boolean} props.isPremium - Whether the current user is premium
 * @param {Array} props.disabledBlocks - List of currently disabled block names
 * @param {Function} props.onChange - Callback when block status changes
 * @param {Array} props.allBlocks - Array of block definitions
 * @param {string} props.status - Saving status ('loading', 'success', 'error')
 * @param {React.Component} [props.ProModal] - Modal component for Pro upsells
 * @returns {JSX.Element}
 */
const Blocks = (props) => {
	const { isPremium, disabledBlocks, onChange, allBlocks, status, ProModal = null, pageTitle = 'All Blocks' } = props;
	const publishedBlocks = allBlocks.filter(b => 'published' === b.status || !b.status);

	const [isSaving, setIsSaving] = useState(false);
	const [disableBlockName, setDisableBlockName] = useState(disabledBlocks || []);
	const [searchTerm, setSearchTerm] = useState('');
	const [toast, setToast] = useState(null);

	// Update disabled blocks when disabledBlocks prop changes
	useEffect(() => {
		if (disabledBlocks) {
			setDisableBlockName(disabledBlocks);
		}
	}, [JSON.stringify(disabledBlocks)]);

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

	const handleActivateAll = () => {
		setDisableBlockName([]);
		onChange?.([]);
		setToast({ message: 'Saving changes...', type: 'loading' });
		setIsSaving(true);
	};

	const handleDeactivateAll = () => {
		// Exclude required blocks from being deactivated
		const allBlockNames = publishedBlocks
			.flatMap(block => {
				if (block.children && Array.isArray(block.children)) {
					return block.children
						.filter(child => !child.required)
						.map(child => child.name);
				} else {
					return block.required ? [] : block.name;
				}
			});
		setDisableBlockName(allBlockNames);
		onChange?.(allBlockNames);
		setToast({ message: 'Saving changes...', type: 'loading' });
		setIsSaving(true);
	};

	// Separate grouped blocks from individual blocks
	const groupedBlocks = [];
	const individualBlocks = [];

	publishedBlocks.forEach(block => {
		if (block.children && Array.isArray(block.children)) {
			groupedBlocks.push(block);
		} else {
			individualBlocks.push(block);
		}
	});

	// Filter blocks based on search term
	const filterBlocksBySearch = (blocksToFilter) => {
		return blocksToFilter.filter(block => {
			if (block.children) {
				// For grouped blocks, check if title or any child matches
				const matchesTitle = block.title?.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesChildren = block.children.some(child =>
					child.title?.toLowerCase().includes(searchTerm.toLowerCase())
				);
				return matchesTitle || matchesChildren;
			} else {
				// For individual blocks
				return block.title?.toLowerCase().includes(searchTerm.toLowerCase());
			}
		});
	};

	const filteredGroupedBlocks = filterBlocksBySearch(groupedBlocks);
	const filteredIndividualBlocks = filterBlocksBySearch(individualBlocks);

	const hasResults = filteredGroupedBlocks.length > 0 || filteredIndividualBlocks.length > 0;

	return <div className='bPlDashboardBlocks'>
		{!isPremium && ProModal && <ProModal />}

		{toast && <Toast message={toast.message} type={toast.type} />}

		<div className='blocksTop'>
			<h2>{pageTitle}</h2>

			<div className='blocksSearch'>
				{searchIcon}

				<input type='text' placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='search-input' />

				{searchTerm && <span onClick={() => setSearchTerm('')}>{closeIcon}</span>}
			</div>

			<Button className='bBlocksDashboardBtn actionBtn activeAllBtn' onClick={handleActivateAll}>
				Activate All
			</Button>

			<Button className='bBlocksDashboardBtn actionBtn deActiveAllBtn' onClick={handleDeactivateAll}>
				Deactivate All
			</Button>
		</div>

		{!hasResults ?
			<h3 className='noBlocksFound'>
				No blocks found matching your search...
			</h3> :
			<div className='blocksContent'>
				{/* Render grouped blocks */}
				{filteredGroupedBlocks.map(group => (
					<div key={group.title} className='blocksGroup'>
						<h3 className='groupTitle'>{group.title}</h3>
						<div className='dashboardBlocks'>
							{group.children
								.filter(child => child.status === 'published' || !child.status)
								.map(childBlock => (
									<Block
										key={childBlock.name}
										block={childBlock}
										isPremium={isPremium}
										disableBlockName={disableBlockName}
										handleCheckboxChange={handleCheckboxChange}
										isSaving={isSaving}
									/>
								))}
						</div>
					</div>
				))}

				{/* Render individual blocks */}
				{filteredIndividualBlocks.length > 0 && (
					<div className='dashboardBlocks'>
						{filteredIndividualBlocks.map(block => (
							<Block
								key={block.name}
								block={block}
								isPremium={isPremium}
								disableBlockName={disableBlockName}
								handleCheckboxChange={handleCheckboxChange}
								isSaving={isSaving}
							/>
						))}
					</div>
				)}
			</div>}
	</div>
};
export default Blocks;