import { Button, Dashicon, Flex, PanelBody, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { copyIcon } from '../../utils/icons';
import Sortable from './Sortable';

const ItemsPanel = (properties) => {
	const { attributes, setAttributes, clientId, arrKey, newItem, ItemSettings, itemLabel = 'Item', activeIndex, setActiveIndex, design = 'single',title='',premiumProps, ...restProps } = properties;
	const items = attributes[arrKey];
	const addNewItem = () => {
		setAttributes({ [arrKey]: [...items, newItem] });

		setActiveIndex && setActiveIndex(items.length);
	};

	const duplicateItem = (e, index) => {
		e.preventDefault();

		setAttributes({ [arrKey]: [...items.slice(0, index), { ...items[index] }, ...items.slice(index)] });

		setActiveIndex && setActiveIndex(index + 1);
	}

	const removeItem = (e, index) => {
		e.preventDefault();

		setAttributes({ [arrKey]: [...items.slice(0, index), ...items.slice(index + 1)] });

		setActiveIndex && setActiveIndex(0 === index ? 0 : index - 1);
	}

	const props = { attributes, setAttributes, clientId, arrKey, ItemSettings, removeItem, duplicateItem, itemLabel, activeIndex,setActiveIndex, premiumProps, title, ...restProps }

	const itemProps = { attributes, setAttributes, clientId, arrKey, setActiveIndex, premiumProps }

	return <>
		{'single' === design && undefined !== activeIndex && <>
			<h3 className='bplItemTitle'>{__(`${itemLabel} ${activeIndex + 1}:`)}</h3>

			<ItemSettings {...itemProps} index={activeIndex} />

			<ItemAction items={items} index={activeIndex} duplicateItem={duplicateItem} removeItem={removeItem} />
		</>}

		{'all' === design && items.map((item, index) => {
			return <PanelBody key={index} className='bPlPanelBody itemPanelBody' title={__(`${itemLabel} ${index + 1}:`)} initialOpen={activeIndex ? activeIndex === index ? true : false : 0 !== index ? false : true}>
				<ItemSettings {...itemProps} index={index} />

				<ItemAction items={items} index={index} duplicateItem={duplicateItem} removeItem={removeItem} />
			</PanelBody>
		})}

		{'sortable' === design && <Sortable {...props} />}

		<Flex justify='center' className='addItem mt15'>
			<Button variant='primary' label={__('Add New') + ' ' + itemLabel} onClick={addNewItem}>
				<Dashicon icon='plus' />
				{__('Add New') + ' ' + itemLabel}
			</Button>
		</Flex>
	</>
};
export default ItemsPanel;

const ItemAction = ({ items, index, duplicateItem, removeItem }) => <PanelRow className='itemAction mt20 mb15'>
	<Button className='duplicateItem' label={__('Duplicate')} onClick={e => duplicateItem(e, index)}>
		{copyIcon}{__('Duplicate')}
	</Button>

	{1 < items?.length && <Button className='removeItem' label={__('Remove')} onClick={e => removeItem(e, index)}>
		<Dashicon icon='no' />
		{__('Remove')}
	</Button>}
</PanelRow>