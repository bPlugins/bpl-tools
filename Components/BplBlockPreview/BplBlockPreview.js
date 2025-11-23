import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Button, Popover } from '@wordpress/components';
import { useState } from 'react';
import { withDispatch } from '@wordpress/data';
import "./style.scss";

const BplBlockPreview = ({ blocks, clientId, value, minHeight = '', minWidth = '200px', viewportWidth = 1600, replaceBlock }) => {
	const [activeIndex, setActiveIndex] = useState(null);

	const handleButtonClick = (idx, content) => {
		setActiveIndex(idx);
		handleBlockReplace(content)
	};

	const handleMouseInteraction = (idx, isEnter) => {
		setActiveIndex(isEnter ? idx : null);
	};

	const handleBlockReplace = (blockContent) => {
		const parsedBlock = parse(blockContent);
		replaceBlock(clientId, parsedBlock);
	};

	return <div className='bPlBlockPreviewWrapper'>
		{blocks.map((block, idx) => (
			<div key={idx}>
				<div>
					<Button
						className={`bPl-previewBtn ${value === block.value ? 'bPl-activeBtn' : ''}`}
						onClick={() => handleButtonClick(idx, block.content)}
						onMouseEnter={() => handleMouseInteraction(idx, true)}
						onMouseLeave={() => handleMouseInteraction(idx, false)}
					>
						{block.label}
					</Button>
				</div>

				{activeIndex === idx && <Popover
					style={{ cursor: 'pointer' }}
					onClick={() => handleButtonClick(idx, block.content)}
				>
					<div
						onMouseEnter={() => handleMouseInteraction(idx, true)}
						onMouseLeave={() => handleMouseInteraction(idx, false)}
						style={{ minWidth, minHeight }}
					>
						<BlockPreview
							blocks={parse(block.content)}
							viewportWidth={viewportWidth}
							minHeight={minHeight}
						/>
					</div>
				</Popover>}
			</div>
		))}
	</div>
};
export default withDispatch((dispatch) => {
	return {
		replaceBlock: dispatch('core/block-editor').replaceBlock,
	};
})(BplBlockPreview);