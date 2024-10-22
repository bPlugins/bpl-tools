import { __ } from '@wordpress/i18n';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import './SortableControl.scss';
import { Label } from '../index';

const SortableItem = SortableElement(({ value }) => <li className='bplSortableListItem'>{value}</li>);

const SortableList = SortableContainer(({ items, property }) => <ul>
	{items.map((value, index) => <SortableItem key={index} index={index} sortIndex={index} value={property ? value[property] : value} />)}
</ul>);

const SortableControl = ({ className = '', label = __('Sort:'), value = [], property, onChange }) => {
	const onSortEnd = ({ oldIndex, newIndex }) => {
		onChange(arrayMove(value, oldIndex, newIndex))
	};
	return <div className={`bplSortableList ${className}`}>
		<Label className='mb5'>{label}</Label>

		<SortableList items={value} property={property} onSortEnd={onSortEnd} />

		<small>{__('Drag and drop to sort')}</small>
	</div>;
}
export default SortableControl;