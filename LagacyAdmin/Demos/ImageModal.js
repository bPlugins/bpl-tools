/**
	* ImageModal Component
	*
	* @props filteredItems (required): Gallery items to navigate, each with url and title (Array)
	* @props activeIdx (required): Index of the initially shown item (Number)
	* @props handleModalClose (required): Callback to close the modal (Function)
	* @props children (optional): Extra content rendered in the modal footer (Node)
	*/

import { useEffect, useState } from 'react';

import { closeIcon, nextIcon, prevIcon } from '../../utils/icons';

const ImageModal = ({ filteredItems, activeIdx, handleModalClose, children }) => {
	const [currentIndex, setCurrentIndex] = useState(activeIdx);
	const imageUrl = filteredItems[activeIdx]?.url;

	useEffect(() => {
		if (imageUrl && filteredItems) {
			const index = filteredItems.findIndex(item => item.url === imageUrl);
			if (index !== -1) {
				setCurrentIndex(index);
			}
		}
	}, [imageUrl, filteredItems]);

	const goToPrevious = () => {
		setCurrentIndex(prevIndex =>
			prevIndex === 0 ? filteredItems.length - 1 : prevIndex - 1
		);
	};

	const goToNext = () => {
		setCurrentIndex(prevIndex =>
			prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1
		);
	};

	const currentItem = filteredItems[currentIndex];

	return <div className='bPlDashboardFilterDemosModal'>
		<div className='filterDemoModal'>
			<div className='modalClose' onClick={handleModalClose}>
				{closeIcon}
			</div>

			{filteredItems.length > 1 && <>
				<button className='modalNav navPrev' onClick={goToPrevious} aria-label='Previous image'>
					{prevIcon}
				</button>

				<button className='modalNav navNext' onClick={goToNext} aria-label='Next image'>
					{nextIcon}
				</button>
			</>}

			<img src={currentItem?.url} alt={currentItem?.title || 'Gallery image'} />

			{currentItem?.title && <div className='modalFooter'>
				<p>{currentItem.title}</p>

				{children}
			</div>}
		</div>
	</div>
};
export default ImageModal;