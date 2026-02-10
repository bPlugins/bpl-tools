
import { useState, useEffect } from 'react';

import './style.scss';

import Button from '../../Components/Button/Button';
import { closeIcon, demoIcon, docsIcon, searchIcon } from '../../utils/icons';

const Toast = ({ message, type }) => {
    return <div className={`dashboardBlocksToast dashboardBlocksToast-${type}`}>
        {type === 'loading' && <span className='spinner'></span>}
        {type === 'success' && <span className='checkmark'>✓</span>}
        {type === 'error' && <span className='error-icon'>✕</span>}
        <span className='message'>{message}</span>
    </div>;
};

const BlockCard = ({ block, isPremium, disableBlockName, handleCheckboxChange, isSaving }) => {
    const { name, title, icon, demo, docs, badge = '', required = false } = block;
    const isBlockPremium = !isPremium && block.isPremium;
    const disabledBlock = isBlockPremium ? false : !disableBlockName.includes(name);
    const isRequired = required === true;

    return <div className={`block ${!disabledBlock ? 'disabled' : ''}`}>
        <div className='icon'>{icon}</div>

        <div className='name'><p className='blockTitle'>{title}</p>{isBlockPremium && <a href='#pricing' target='_blank' rel='noopener noreferrer'>Get Pro</a>} </div>

        {demo && <a className='actionBtn' href={demo} target='_blank' rel='noopener noreferrer'>
            {demoIcon}
        </a>}

        {docs && <a className='actionBtn' href={docs} target='_blank' rel='noopener noreferrer'>
            {docsIcon}
        </a>}

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

const Blocks = (props) => {
    const { isPremium, disabledBlocks, onChange, allBlocks, status, ProModal = null } = props;
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
            <h2>All Blocks</h2>

            <div className='blocksSearch'>
                {searchIcon}

                <input type='text' placeholder='Search blocks...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='search-input' />

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
                        <div className='blocks'>
                            {group.children
                                .filter(child => child.status === 'published' || !child.status)
                                .map(childBlock => (
                                    <BlockCard
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
                    <div className='blocks'>
                        {filteredIndividualBlocks.map(block => (
                            <BlockCard
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