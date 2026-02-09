// import { __ } from '@wordpress/i18n';
// import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

// import './SortableControl.scss';
// import { Label } from '../index';

// const SortableItem = SortableElement(({ value }) => <li className='bplSortableListItem'>{value}</li>);

// const SortableList = SortableContainer(({ items, property }) => <ul>
// 	{items.map((value, index) => <SortableItem key={index} index={index} sortIndex={index} value={property ? value[property] : value} />)}
// </ul>);

// const SortableControl = ({ className = '', label = __('Sort:'), value = [], property, onChange }) => {
// 	const onSortEnd = ({ oldIndex, newIndex }) => {
// 		onChange(arrayMove(value, oldIndex, newIndex))
// 	}

// 	return <div className={`bplSortableList ${className}`}>
// 		<Label className='mb5'>{label}</Label>

// 		<SortableList items={value} property={property} onSortEnd={onSortEnd} />

// 		<small>{__('Drag and drop to sort')}</small>
// 	</div>;
// }
// export default SortableControl;

import { __ } from '@wordpress/i18n';
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

import './SortableControl.scss';
import { Label } from '../index';

const SortableItem = ({ id, text }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? transition : 'none'
	};

	return (
		<li ref={setNodeRef} style={style} className="bplSortableListItem" {...attributes} {...listeners}>
			{text}
		</li>
	);
};

const SortableControl = ({
	className = '',
	label = __('Sort:'),
	value = [],
	property,
	onChange
}) => {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
	);

	const items = value.map((item, index) => {
		const id = item?.id ?? item?._id ?? item?.key ?? `item-${index}`;
		const text = property ? item?.[property] : item;
		return { id, text };
	});

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex((i) => i.id === active.id);
		const newIndex = items.findIndex((i) => i.id === over.id);

		onChange(arrayMove(value, oldIndex, newIndex));
	};

	return (
		<div className={`bplSortableList ${className}`}>
			<Label className="mb5">{label}</Label>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
					<ul>
						{items.map((item) => (
							<SortableItem key={item.id} id={item.id} text={item.text} />
						))}
					</ul>
				</SortableContext>
			</DndContext>

			<small>{__('Drag and drop to sort')}</small>
		</div>
	);
};

export default SortableControl;
