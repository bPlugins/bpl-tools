import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Button, Popover } from '@wordpress/components';
import { useState } from 'react';
import "./style.scss";

const BplBlockPreview = ({ 
  blocks,
  clientId,
  value,
  onChange,
  minHeight = "", 
  minWidth = "200px" 
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleButtonClick = (blockValue, idx,content) => {
    onChange(blockValue);
    setActiveIndex(idx);
    handleBlockReplace(content)
  };

  const handleMouseInteraction = (idx, isEnter) => {
    setActiveIndex(isEnter ? idx : null);
  };

  const handleBlockReplace = (blockContent) => {
    const parsedBlock = parse(blockContent);
    wp.data.dispatch('core/block-editor').replaceBlock(clientId, parsedBlock);
  };

  return (
    <div className='bPlBlockPreviewWrapper'>
      {blocks.map((block, idx) => (
        <div key={idx}>
          <div>    <Button
            className={`bPl-previewBtn ${value === block.value ? "bPl-activeBtn" : ""}`}
            onClick={() => handleButtonClick(block.value, idx,block.content)}
            onMouseEnter={() => handleMouseInteraction(idx, true)}
            onMouseLeave={() => handleMouseInteraction(idx, false)}
          >
          {block.label}
          </Button></div>
          {activeIndex === idx && (
            <Popover 
              style={{cursor: "pointer"}} 
              onClick={() => handleButtonClick(block.value, idx,block.content)}
            >
              <div
                onMouseEnter={() => handleMouseInteraction(idx, true)}
                onMouseLeave={() => handleMouseInteraction(idx, false)}
                style={{ minWidth, minHeight }}
              >
                <BlockPreview
                  blocks={parse(block.content)}
                  viewportWidth={1600}
                />
              </div>
            </Popover>
          )}
        </div>
      ))}
    </div>
  );
};

export default BplBlockPreview;