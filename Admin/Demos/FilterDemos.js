import { useState } from 'react';

import BButtonGroup from '../../Components/BButtonGroup/BButtonGroup';

import './FilterDemos.scss'
import ImageModal from './ImageModal';
import { primaryColor } from '../../utils/data';

const FilterDemos = (props) => {
	const { demoInfo, children } = props;
	const { categories = [], demos = [] } = demoInfo;

	const [category, setCategory] = useState(categories[0]?.value || 'all');
	const [activeIdx, setActiveIdx] = useState(0);
	const [isOpen, setIsOpen] = useState(false)

	const filteredItems = category === 'all' ?
		demos :
		demos.filter(d => d.categories?.includes(category));

	const isSet = v => v !== undefined && v !== null;

	const handleModalClose = () => {
		setIsOpen(false)
	};
	const getCategoryValue = (key) => {
		const catItem = categories.find(c => c.value === category);
		return catItem?.[key];
	};

	const col = getCategoryValue('col');
	const height = getCategoryValue('height');

	const dynamicStyle = {
		...(isSet(col) && { '--bpl-admin-demo-col': col }),
		...(isSet(height) && { '--bpl-admin-demo-item-height': height })
	};

	return <div className='bPlDashboardFilterDemos bPlDashboardBox'>
		{isOpen ?
			<ImageModal filteredItems={filteredItems} activeIdx={activeIdx} handleModalClose={handleModalClose}>
				{children}
			</ImageModal>
			: null
		}

		<div className='demoHeader'>
			<BButtonGroup label='' value={category} onChange={value => setCategory(value)} options={categories} activeBg={primaryColor} wrap={true} fontSize='16px' style={{ marginBottom: '0' }} />

			{children}
		</div>

		<div className='filteredItems' style={dynamicStyle}>
			{filteredItems.map((item, i) => {
				const { url, title } = item;

				return <div className='filterItem' key={i}>
					<img className='filterItemImg' src={url} alt={title} onClick={() => {
						setActiveIdx(i);
						setIsOpen(true);
					}} />

					<p>{title}</p>
				</div>
			})}
		</div>
	</div>
}
export default FilterDemos;