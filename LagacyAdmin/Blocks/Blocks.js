import { useState, useEffect } from 'react';

import { useWPAjax } from '../../hooks';

import { closeIcon, demoIcon, docsIcon, searchIcon } from '../../utils/icons';

import "./style.scss"

const dataFetched = new CustomEvent('dataFetched');

const Blocks = ({ info, nonce }) => {
	const { action, blocks = [], title = 'All Blocks' } = info || {};
	const [isSaving, setIsSaving] = useState(false);
	const [disableBlockName, setDisableBlockName] = useState([]);
	const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
	// const { blocksName = [] } = disableBlockName || {};
	const { data = null, refetch, saveData, isLoading, error } = useWPAjax(action, { _wpnonce: nonce }, true);

	useEffect(() => {
		refetch()
	}, [nonce, action]);

	useEffect(() => {
		if (!isLoading && data) {
			setDisableBlockName(data || []);
			window.dispatchEvent(dataFetched);
		}
	}, [data, isLoading, error]);

	const handleCheckboxChange = (blockName, isChecked) => {
		const updatedBlocksName = isChecked ?
			disableBlockName.filter((name) => name !== blockName) :
			[...disableBlockName, blockName];

		setDisableBlockName(updatedBlocksName);
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify(updatedBlocksName) });
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	const handleActivateAll = () => {
		setDisableBlockName([]);
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify([]) });
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	const handleDeactivateAll = () => {
		const updatedBlocksName = blocks.map((block) => block.name);
		setDisableBlockName(updatedBlocksName);
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify(updatedBlocksName) });
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	// Filter blocks based on the search term
	const searchedBlocks = blocks.filter((block) =>
		block?.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return <>
		<div className='bPlblocksPage'>
			{isSaving && <div className='bPlSavingNotice'>Saving changes...</div>}
			<div className='blocksTop'>
				<h2>{title}</h2>

				<div className='bPlDashboardSearch'>
					{searchIcon}

					<input type='text' placeholder='Search blocks...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='search-input' />

					{searchTerm && <span onClick={() => setSearchTerm('')}>{closeIcon}</span>}
				</div>

				<button className='bPlDashboardBtn actionBtn activeAllBtn' onClick={handleActivateAll}>
					Activate All
				</button>

				<button className='bPlDashboardBtn actionBtn secondary' onClick={handleDeactivateAll}>
					Deactivate All
				</button>
			</div>

			{searchedBlocks.length === 0 ?
				<h3 className='noBlocksFound'>
					No blocks found matching your search...
				</h3> :
				<div className='blocks'>
					{searchedBlocks.map(block => {
						const { name, title, icon, demo, docs } = block;

						return <div key={name} className={`block ${disableBlockName.includes(name) ? 'disabled' : ''}`}>
							<div className='icon'>{icon}</div>

							<div className='name'>{title}</div>

							{demo && <a className='actionBtn' href={demo} target='_blank' rel='noopener noreferrer'>
								{demoIcon}
							</a>}

							{docs && <a className='actionBtn' href={docs} target='_blank' rel='noopener noreferrer'>
								{docsIcon}
							</a>}

							<label className='toggleSwitch'>
								<input type='checkbox' checked={!disableBlockName.includes(name)} onChange={(e) => handleCheckboxChange(name, e.target.checked)} disabled={isSaving} />
								<span className='slider'></span>
							</label>
						</div>
					})}
				</div>}
		</div>
	</>
};
export default Blocks;