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
										{/* {__('Preview')}
										{externalIcon} */}
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" /></svg>
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
