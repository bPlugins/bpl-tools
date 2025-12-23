// import { useEffect, useState } from 'react';
// import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

// import { closeIcon, copyIcon, gripIcon } from '../../utils/icons';
// import './Sortable.scss';

// const DragHandle = SortableHandle(() => <div className='gripIcon'>{gripIcon}</div>);

// const SortableItem = SortableElement(({ sortIndex: index, removeItem, duplicateItem, ItemSettings, active, setActive, itemLabel, minItem, title, ...props }) => {
// 	const { value, attributes, arrKey, setActiveIndex } = props;
// 	const items = attributes ? attributes[arrKey] : value;
// 	const itemTitle = items?.[index]?.[title] || '';

// 	return <div key={index} className='bPlSortablePanelItem'>
// 		<div className='itemsPanelHeader mt10'>
// 			<DragHandle />

// 			<div className='panel-header-title'>
// 				<div className='repeater-panel-title' onClick={() => {
// 					setActive(active === index ? null : index)
// 					setActiveIndex && setActiveIndex(index);
// 				}}>
// 					{title ? itemTitle : itemLabel + ' ' + (index + 1)}
// 				</div>

// 				<div className='itemAction'>
// 					<div onClick={e => duplicateItem(e, index)}>{copyIcon}</div>

// 					{items.length > Number(minItem) && <div onClick={e => removeItem(e, index)}>{closeIcon}</div>}
// 				</div>
// 			</div>
// 		</div>

// 		<div className={`itemsPanelBody ${active === index ? '' : 'hidden'}`}>
// 			<ItemSettings {...props} index={index} />
// 		</div>
// 	</div>
// });

// const SortableList = SortableContainer((props) => {
// 	const { value, attributes, arrKey } = props;
// 	const items = attributes ? attributes[arrKey] : value;

// 	return <div className='bPlItemsPanel'>
// 		{items.map((_, index) => <SortableItem key={index} index={index} sortIndex={index}	{...props} />)}
// 	</div>
// });

// const Sortable = (props) => {
// 	const { value, onChange, attributes, setAttributes, arrKey, activeIndex } = props;
// 	const items = attributes ? attributes[arrKey] : value;

// 	const [active, setActive] = useState(activeIndex || 0);
// 	const onSortEnd = ({ oldIndex, newIndex }) => {
// 		const newValue = arrayMove(items, oldIndex, newIndex);

// 		attributes ? setAttributes({ [arrKey]: newValue }) : onChange(newValue);
// 	};

// 	useEffect(() => {
// 		setActive(activeIndex || 0);
// 	}, [activeIndex]);

// 	const sortProps = {
// 		...props,
// 		active,
// 		setActive,
// 		onSortEnd
// 	}

// 	return <SortableList useDragHandle {...sortProps} />
// };
// export default Sortable;


import { useEffect, useState } from 'react';

import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core';

import {
	SortableContext,
	useSortable,
	arrayMove,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { closeIcon, copyIcon, gripIcon } from '../../utils/icons';
import './Sortable.scss';

const DragHandle = ({ listeners }) => (
	<div className="gripIcon" {...listeners}>
		{gripIcon}
	</div>
);

const SortableItem = ({
	id,
	index,
	removeItem,
	duplicateItem,
	ItemSettings,
	active,
	setActive,
	itemLabel,
	minItem,
	title,
	...props
}) => {
	const { value, attributes, arrKey, setActiveIndex } = props;
	const items = attributes ? attributes[arrKey] : value;
	const itemTitle = items?.[index]?.[title] || '';

	const {
		setNodeRef,
		transform,
		transition,
		listeners,
		isDragging
	} = useSortable({ id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? transition : 'none'
	};

	return (
		<div ref={setNodeRef} style={style} className="bPlSortablePanelItem">
			<div className="itemsPanelHeader mt10" {...listeners}>
				<DragHandle listeners={listeners} />
				<div className="panel-header-title">
					<div
						className="repeater-panel-title"
						onClick={() => {
							setActive(active === index ? null : index);
							setActiveIndex?.(index);
						}}
					>
						{title ? itemTitle : `${itemLabel} ${index + 1}`}
					</div>
					<div className="itemAction">
						<div onClick={(e) => duplicateItem(e, index)}>{copyIcon}</div>
						{items.length > Number(minItem) && (
							<div onClick={(e) => removeItem(e, index)}>{closeIcon}</div>
						)}
					</div>
				</div>
			</div>
			<div className={`itemsPanelBody ${active === index ? '' : 'hidden'}`}>
				<ItemSettings {...props} index={index} />
			</div>
		</div>
	);
};

const Sortable = (props) => {
	const { value, onChange, attributes, setAttributes, arrKey, activeIndex } = props;

	const items = attributes ? attributes[arrKey] : value;

	const [active, setActive] = useState(activeIndex ?? 0);
	useEffect(() => setActive(activeIndex ?? 0), [activeIndex]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
	);

	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) return;

		const newValue = arrayMove(items, active.id, over.id);

		attributes
			? setAttributes({ [arrKey]: newValue })
			: onChange(newValue);
	};

	return (
		<DndContext
			sensors={sensors}
			modifiers={[restrictToVerticalAxis]}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map((_, index) => index)}
				strategy={verticalListSortingStrategy}
			>
				<div className="bPlItemsPanel">
					{items.map((_, index) => (
						<SortableItem
							key={index}
							id={index}
							index={index}
							active={active}
							setActive={setActive}
							{...props}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};

export default Sortable;


