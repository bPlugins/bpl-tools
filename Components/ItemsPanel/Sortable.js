import { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import './Sortable.scss';
import { closeIcon, copyIcon, gripIcon } from '../../utils/icons';

const DragHandle = SortableHandle(() => <div className='gripIcon'>{gripIcon}</div>);

const SortableItem = SortableElement(({ sortIndex: index, removeItem, duplicateItem, ItemSettings, active, setActive, itemLabel, ...props }) => {
	const { attributes, arrKey } = props;
	const items = attributes[arrKey];

	return <div className='bPlSortablePanelItem'>
		<div className='itemsPanelHeader mt10'>
			<DragHandle />

			<div className='panel-header-title'>
				<p onClick={() => setActive(active === index ? null : index)}>
					{itemLabel + ' ' + (index + 1)}
				</p>

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
	const { attributes, arrKey } = props;
	const items = attributes[arrKey];

	return <div className='bPlItemsPanel'>
		{items.map((__, index) => <SortableItem key={index} index={index} sortIndex={index}	{...props} />)}
	</div>
});

const Sortable = (props) => {
	const { attributes, setAttributes, arrKey } = props;
	const items = attributes[arrKey];

	const [active, setActive] = useState(0);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setAttributes({ [arrKey]: arrayMove(items, oldIndex, newIndex) });
	};

	const sortProps = {
		...props,
		active,
		setActive,
		onSortEnd
	}

	return <SortableList useDragHandle {...sortProps} />
};
export default Sortable;