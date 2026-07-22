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

import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import { Spinner } from '@wordpress/components';

import { externalIcon, plusIcon, heartIcon, heartFillIcon, crownIcon } from '../../utils/icons';

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
	pricingUrl = 'https://bplugins.com/pricing/',
	favorites,
	toggleFavorite
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const visible = (templates || []).filter((item) => {
		if ('pro' === access) return isProItem(item);
		if ('free' === access) return !isProItem(item);
		return true;
	});

	// Show the spinner only while a fetch is in flight AND nothing is on screen
	// yet — never when items already exist (e.g. Load More), so the gallery
	// stays put, and never fall through to "Not Found" during that window.
	const isBusy = (templatesLoading || mainLoading) && !templates?.length;

	return <div className='modalBodyCanvas'>
		{isBusy ?
			<div className='bPlPlaceCenter'>
				<Spinner className='bPlSpinner' />
			</div> :
			visible.length ? <>
				<div className='bPlTemplatesGallery'>
					{visible.map((item) => {
						const { ID, category, original_content, thumbnail, preview_url, title } = item;
						const isPro = category?.includes('pro');

						// On the Favorites tab items carry their own type via __type
						const itemType = item.__type || type;
						const isFav = (favorites?.[itemType] || []).includes(ID);

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

						return <div className={`template ${itemType === 'pages' ? 'isPages' : ''}`} key={`${itemType}-${ID}`}>
							<div className='templatePreview'>
								<div className='templateActions'>
									{preview_url && <a className='templatePreviewBtn' href={preview_url} target='_blank' rel='noreferrer'>
										{__('Preview')}
										{externalIcon}
									</a>}

									<button
										className={`templateFavoriteBtn ${isFav ? 'isFav' : ''}`}
										aria-pressed={isFav}
										aria-label={isFav ? __('Remove from favorites') : __('Add to favorites')}
										onClick={() => toggleFavorite(itemType, ID)}
									>
										{isFav ? heartFillIcon : heartIcon}
									</button>
								</div>

								<div className='templateMedia'>
									{thumbnail ?
										<img src={thumbnail} alt={title} className='templateThumbnail' /> :
										<BlockPreview blocks={parse(original_content)} viewportWidth={1600} />}
								</div>
							</div>

							<div className='templateFooter'>
								{title && <>
									{preview_url ?
										<a className='templateTitle' href={preview_url} target='_blank' rel='noreferrer'>
											<span>{title}</span>
											{externalIcon}
										</a> :
										<div className='templateTitle'>
											<span>{title}</span>
										</div>
									}
								</>}

								<a className={`templateImportBtn ${hasAccess ? '' : 'isPro'} ${isLoading === ID ? 'disabled' : ''}`} {...linkProps}>
									{isLoading === ID ? <Spinner className='bPlSpinner' /> : hasAccess ? <>
										{plusIcon}
										{__('Import')}
									</> : <>
										{crownIcon}
										{__('Get Pro')}
									</>}
								</a>
							</div>
						</div>
					})}
				</div>

				{children}
			</> :
				<div className='bPlPlaceCenter templatesNotFound'>
					{__('No Templates Found!!')}
				</div>}
	</div>;
};
export default Templates;
