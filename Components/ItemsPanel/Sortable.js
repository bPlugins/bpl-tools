import { useEffect, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import './Sortable.scss';
import { closeIcon, copyIcon, gripIcon } from '../../utils/icons';

const DragHandle = SortableHandle(() => <div className='gripIcon'>{gripIcon}</div>);

const SortableItem = SortableElement(({ sortIndex: index, removeItem, duplicateItem, ItemSettings, active, setActive, itemLabel, title, ...props }) => {
	const { value, attributes, arrKey, setActiveIndex } = props;
	const items = attributes ? attributes[arrKey] : value[arrKey];
	const itemTitle = items?.[index]?.[title] || '';

	return <div className='bPlSortablePanelItem'>
		<div className='itemsPanelHeader mt10'>
			<DragHandle />

			<div className='panel-header-title'>
				<div className='repeater-panel-title' onClick={() => {
					setActive(active === index ? null : index)
					setActiveIndex && setActiveIndex(index);
				}}>
					{title ? itemTitle : itemLabel + ' ' + (index + 1)}
				</div>

				<div className='itemAction'>
					<div onClick={e => duplicateItem(e, index)}>{copyIcon}</div>

					{items.length > 1 && <div onClick={e => removeItem(e, index)}>{closeIcon}</div>}
				</div>
			</div>
		</div>

		<div className={`itemsPanelBody ${active === index ? '' : 'hidden'}`}>
			<ItemSettings {...props} index={index} />
		</div>
	</div>
});

const SortableList = SortableContainer((props) => {
	const { value, attributes, arrKey } = props;
	const items = attributes ? attributes[arrKey] : value[arrKey];

	return <div className='bPlItemsPanel'>
		{items.map((_, index) => <SortableItem key={index} index={index} sortIndex={index}	{...props} />)}
	</div>
});

const Sortable = (props) => {
	const { value, onChange, attributes, setAttributes, arrKey, activeIndex } = props;
	const items = attributes ? attributes[arrKey] : value[arrKey];

	const [active, setActive] = useState(activeIndex || 0);
	const onSortEnd = ({ oldIndex, newIndex }) => {
		const newValue = arrayMove(items, oldIndex, newIndex);

		attributes ? setAttributes({ [arrKey]: newValue }) : onChange(newValue);
	};

	useEffect(() => {
		setActive(activeIndex || 0);
	}, [activeIndex]);

	const sortProps = {
		...props,
		active,
		setActive,
		onSortEnd
	}

	return <SortableList useDragHandle {...sortProps} />
};
export default Sortable;