/**
	* Templates Component
	*
	* @props isPremium (optional): Whether pro access is active (Boolean)
	* @props type (optional): Active template type ('patterns' or 'pages') (String)
	* @props setShow (required): Modal visibility setter (Function)
	* @props mainLoading (optional): Whether category data is loading (Boolean)
	* @props templates (optional): Templates list to render (Array)
	* @props templatesLoading (optional): Whether templates are currently loading (Boolean)
	* @props access (optional): 'all' Access filter applied to templates (String)
	* @props children (optional): Footer content rendered below the gallery (Node)
	* @props nonce (required): Nonce for the import AJAX request (String)
	* @props ajaxActionImport (optional): 'prefix_template_import' (String)
	* @props pricingUrl (optional): 'https://bplugins.com/pricing/' (String)
	*/

import { useState, useEffect } from 'react';
import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Spinner } from '@wordpress/components';

import { externalIcon, plusIcon } from '../../utils/icons';

const isProItem = (item) => Array.isArray(item.category) && item.category.includes('pro');

const Templates = ({
	isPremium,
	type,
	setShow,
	mainLoading,
	templates,
	templatesLoading,
	access = 'all',
	children,
	nonce,
	ajaxActionImport,
	pricingUrl = 'https://bplugins.com/pricing/'
}) => {
	const importButtonLabel = 'Import';
	const proButtonLabel = 'Get Pro';
	const noTemplatesText = 'No Templates Found!!';
	const [isLoading, setIsLoading] = useState(false);
	const [isTempLoading, setIsTempLoading] = useState(false);

	const visible = (templates || []).filter((item) => {
		if ('pro' === access) return isProItem(item);
		if ('free' === access) return !isProItem(item);
		return true;
	});

	useEffect(() => {
		if (templatesLoading) {
			setTimeout(() => {
				setIsTempLoading(true);
			}, 1000);
		} else {
			setIsTempLoading(false);
		}
	}, [templatesLoading]);

	return <div className='modalBodyTemplates'>
		{templates?.length ? <>
			{visible.length ? <div className='modalBodyTemplatesGallery'>
				{visible.map((item, index) => {
					const { ID, original_content, category, thumbnail } = item;
					const isPro = category?.includes('pro');

					const hasAccess = isPremium || !isPro;

					const linkProps = hasAccess ? {
						onClick: () => {
							setIsLoading(ID);

							wp.ajax
								.post(ajaxActionImport, { _wpnonce: nonce, original_content })
								.done((res) => {
									setIsLoading(false);

									if (res) {
										const content = res
											.replaceAll('\\"', '"')
											.replaceAll(`\\\\u003cbr\\\\u003e`, '<br/>')
											.replaceAll(`\\\\u003cstrong\\\\u003e`, '<strong>')
											.replaceAll(`\\\\u003c/strong\\\\u003e`, '</strong>')
											.replaceAll(`\\\\u003cem\\\\u003e`, '<em>')
											.replaceAll(`\\\\u003c/em\\\\u003e`, '</em>');

										try {
											const blocks = parse(content);
											wp.data.dispatch('core/block-editor').insertBlocks(blocks);
											setShow(false);
										} catch (error) {
											// eslint-disable-next-line no-console
											console.error(error);
										}
									}
								})
								.fail((error) => {
									// eslint-disable-next-line no-console
									console.error(error);
									setIsLoading(false);
								});
						}
					} : {
						href: pricingUrl,
						target: '_blank',
						rel: 'noreferrer'
					};

					return <div className={`modalBodyTemplateItem ${type === 'pages' ? 'isPages' : ''}`} key={index}>
						<div className='modalBodyTemplateItemPreviewWrap'>
							<div className='modalBodyTemplateItemPreview'>
								{item.preview_url && <img src={item.preview_url} alt={item.name} className='modalBodyTemplateItemPreviewImg' />}
								{!item.preview_url && thumbnail && <img src={thumbnail} alt={item.name} className='modalBodyTemplateItemPreviewImg' />}
								{!item.preview_url && !thumbnail && <BlockPreview blocks={parse(original_content)} viewportWidth={1600} />}
							</div>

							<div className='modalBodyTemplateItemButton'>
								<a className={isLoading === ID ? 'disabled' : ''} {...linkProps}>
									{hasAccess ? <>
										{plusIcon}
										{importButtonLabel}
									</> : <>
										{proButtonLabel}
										{externalIcon}
									</>}
								</a>

								{isLoading === ID && <Spinner className='bPlSpinner' />}
							</div>
						</div>

						{item.title && <div className='modalBodyTemplateItemTitle' dangerouslySetInnerHTML={{ __html: item.title }} />}
					</div>
				})}
			</div> : <>
				<div className='bPlPlaceCenter modalBodyTemplateNotFound'>{noTemplatesText}</div>
			</>}
			{children}
		</> : <>
			{mainLoading || isTempLoading ? <div className='bPlPlaceCenter'>
				<Spinner className='bPlSpinner' />
			</div> : <div className='bPlPlaceCenter modalBodyTemplateNotFound'>{noTemplatesText}</div>}
		</>}
	</div>;
};
export default Templates;
