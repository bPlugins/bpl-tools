/**
	* IconLibrary Component
	*
	* @props className (optional): '' (String)
	* @props label (optional): __('Icon Library') (String)
	* @props value (required): The selected icon (String)
	* @props onChange (optional): (Function)
	*/

import { useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelRow, Flex, Button } from '@wordpress/components';

import './IconLibrary.scss';
import Label from '../Label/Label';
import Loading from '../Loading/Loading';
import { debounce } from '../../utils/functions';
import { LogoSmall, MagnifyingGlass, XMarkIcon } from './utils/icons';

const prefix = 'bPlIconLibrary';

// The three icon sets are ~3.2MB of JSON. Importing them statically put all of
// it in the consuming plugin's main editor bundle, where it was downloaded on
// every editor page load even though the picker is only opened occasionally.
// They are fetched with import() on first open instead, so webpack emits them
// as separate chunks. Resolved once per page, then reused by every instance.
let iconSetsPromise = null;

const loadIconSets = () => {
	if (!iconSetsPromise) {
		iconSetsPromise = Promise.all([
			import(/* webpackChunkName: "bpl-icons-fontawesome" */ './icons/font-awesome.json'),
			import(/* webpackChunkName: "bpl-icons-bootstrap" */ './icons/bootstrap.json'),
			import(/* webpackChunkName: "bpl-icons-lucid" */ './icons/lucidicons.json'),
		]).then(([fontAwesome, bootstrap, lucid]) => ({
			fontawesome: fontAwesome.default || fontAwesome,
			bootstrap: bootstrap.default || bootstrap,
			lucid: lucid.default || lucid,
		})).catch((err) => {
			// Let a failed load be retried the next time the modal is opened.
			iconSetsPromise = null;
			throw err;
		});
	}

	return iconSetsPromise;
};

const IconLibrary = ({ className = '', label = __('Icon Library'), value, onChange = () => { } }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [iconLibrary, setIconLibrary] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [searchedIcons, setSearchedIcons] = useState({});
	const [selectIcon, setSelectIcon] = useState(value || '');
	const [currentPage, setCurrentPage] = useState(1);
	const [iconSets, setIconSets] = useState(null);
	const [loadError, setLoadError] = useState(false);

	const iconRef = useRef(null);
	const containerRef = useRef(null);
	const sentinelRef = useRef(null);

	const items = [
		{ label: __('All Icons'), value: 'all' },
		{ label: 'Font Awesome', value: 'fontawesome' },
		{ label: 'Bootstrap', value: 'bootstrap' },
		{ label: 'Lucid Icons', value: 'lucid' },
	];

	useEffect(() => {
		if (!isOpen || iconSets) {
			return;
		}

		let cancelled = false;

		setLoadError(false);
		loadIconSets().then((sets) => {
			if (!cancelled) {
				setIconSets(sets);
			}
		}).catch(() => {
			if (!cancelled) {
				setLoadError(true);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [isOpen]);

	const library = useMemo(() => iconSets ? {
		fontawesome: {
			label: 'Font Awesome',
			styles: ['regular', 'solid', 'brands'],
			icons: iconSets.fontawesome,
		},
		bootstrap: {
			label: 'Bootstrap',
			styles: ['regular', 'fill'],
			icons: iconSets.bootstrap,
		},
		lucid: {
			label: 'Lucid Icons',
			styles: ['regular'],
			icons: iconSets.lucid,
		},
	} : {}, [iconSets]);

	const icons = useMemo(() => {
		if (!iconSets) {
			return { label: __('All Icons'), icons: [] };
		}

		return iconLibrary !== 'all'
			? library[iconLibrary]
			: { label: __('All Icons'), icons: [...iconSets.fontawesome, ...iconSets.bootstrap, ...iconSets.lucid] };
	}, [iconSets, iconLibrary, library]);

	const handleSearch = useMemo(() => debounce((sq, allIcons) => {
		const query = (sq || '').trim().toLowerCase();
		if (!query) {
			setSearchedIcons({ icons: allIcons });
			return;
		}

		const filteredIcons = allIcons.filter((icon) => {
			const iconLabel = icon.label ? icon.label.toLowerCase() : '';
			const terms = icon.terms
				? icon.terms.map((term) => term.toLowerCase())
				: [];
			return (
				terms.some((term) => term.includes(query)) ||
				iconLabel.includes(query)
			);
		});
		setSearchedIcons({ icons: filteredIcons });
	}, 300), []);

	const handleInputChange = (e) => {
		const sq = e.target.value;
		setSearchQuery(sq);
		setCurrentPage(1);
		if (containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
		handleSearch(sq, icons.icons || []);
	};

	const handleCategoryChange = (val) => {
		setIconLibrary(val);
		setSearchQuery('');
		setCurrentPage(1);
		if (containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
	};

	useEffect(() => {
		setSearchedIcons({ icons: icons.icons });
		setCurrentPage(1);
		if (containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
	}, [iconLibrary, iconSets]);

	useEffect(() => {
		setSelectIcon(value);
	}, [isOpen]);

	useEffect(() => {
		const handle = (e) => {
			if (!iconRef?.current?.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handle);
		return () => {
			document.removeEventListener('mousedown', handle);
		};
	}, [isOpen, iconRef?.current]);

	const totalIcons = searchedIcons?.icons?.length || 0;
	const hasMore = currentPage * 100 < totalIcons;

	useEffect(() => {
		const sentinel = sentinelRef.current;
		const container = containerRef.current;
		if (!sentinel || !container || !isOpen || !hasMore) {
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setCurrentPage((prev) => prev + 1);
				}
			},
			{
				root: container,
				rootMargin: '150px',
				threshold: 0,
			}
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [isOpen, hasMore, currentPage, searchedIcons]);

	return <div className={prefix}>
		<PanelRow className={className}>
			<Label className=''>{label}</Label>

			<Flex align='center' gap={4} justify='right'>
				{value && <div className='panel-icon' dangerouslySetInnerHTML={{ __html: value }} />}

				<Button variant='primary' onClick={() => setIsOpen(true)} icon='edit' />
				{value && <Button className={`${prefix}-removeIconBtn`} variant='tertiary' onClick={() => onChange('')} icon='trash' />}
			</Flex>
		</PanelRow>

		{isOpen && <div className={`${prefix}ModalWrapper ${isOpen ? 'isOpen' : ''}`}>
			<div ref={iconRef} className={`${prefix}Modal`}>
				<div className={`${prefix}Header`}>
					<div className={`${prefix}HeaderLogo`}>
						<LogoSmall />

						<h3>{__('Icon Library')}</h3>
					</div>

					<div className={`${prefix}HeaderClose`}>
						<XMarkIcon onClick={() => setIsOpen(false)} />
					</div>
				</div>

				<div className={`${prefix}Body`}>
					<div className={`${prefix}Sidebar`}>
						<ul className={`${prefix}SidebarMenu`}>
							{items.map((item, i) => <li key={i} className={`${item.value === iconLibrary ? 'active' : ''}`} onClick={() => handleCategoryChange(item.value)}>
								{item.label}
							</li>)}
						</ul>
					</div>

					<div className={`${prefix}Main`}>
						<div className={`${prefix}Search`}>
							<input value={searchQuery} onChange={handleInputChange} type='text' className={`${prefix}SearchInput`} placeholder={__('Filter by name...')} disabled={!iconSets} />

							<MagnifyingGlass className={`${prefix}SearchIcon`} />
						</div>

						<div className={`${prefix}IconsWrapper`}>
							{loadError && <p className={`${prefix}LoadError`}>{__('Could not load the icons. Please close and reopen the library to try again.')}</p>}

							{!iconSets && !loadError &&
								<div className={`${prefix}-loadingWrapper`}>
									<Loading text={__('Loading icons...')} orientation='vertical' />
								</div>
							}

							{iconSets && <div ref={containerRef} className={`${prefix}Icons`}>
								{searchedIcons?.icons?.length === 0 && searchQuery && (
									<p className={`${prefix}NoResults`}>{__('No icons found matching your search.')}</p>
								)}

								{searchedIcons?.icons?.slice(0, currentPage * 100).map((icon, iconIdx) => {
									const svgIcons = icon.svg || {};

									return Object.keys(svgIcons).map((key) => {
										const svgContent = svgIcons[key];
										const isSelected = selectIcon === svgContent;

										return <div
											key={`${icon.label}-${key}-${iconIdx}`}
											onClick={() => setSelectIcon(svgContent)}
											className={`${prefix}Icon ${isSelected ? 'isActive' : ''} `}
										>
											<span dangerouslySetInnerHTML={{ __html: svgContent }} />

											<div className={`${prefix}IconLabel`} title={icon.label}>
												{icon.label}
											</div>
										</div>;
									});
								})}

								{hasMore && (
									<div
										ref={sentinelRef}
										className={`${prefix}Sentinel`}
									/>
								)}
							</div>}
						</div>
					</div>
				</div>

				<div className={`${prefix}Footer`}>
					<button className={`${prefix}FooterInsert`} onClick={() => {
						onChange(selectIcon);
						setIsOpen(false);
					}}>{__('Insert')}</button>
				</div>
			</div>
		</div>}
	</div>
};
export default IconLibrary;
