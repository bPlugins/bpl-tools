import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelRow, Flex, Button } from '@wordpress/components';

import './IconLibrary.scss';
import { Label } from '../Label/Label';
import bootstrapIcons from './icons/bootstrap.json';
import fontAwesomeIcons from './icons/font-awesome.json';
import { debounce } from '../../utils/functions';
import { LogoSmall, MagnifyingGlass, XMarkIcon } from './utils/icons';

export const IconLibrary = ({ className = '', label = __('Icon Library'), value, onChange = () => { } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [iconLibrary, setIconLibrary] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedIcons, setSearchedIcons] = useState({});
    const [selectIcon, setSelectIcon] = useState(value || '');
    const iconRef = useRef(null);

    const items = [
        { label: 'All Icons', value: 'all' },
        { label: 'Font Awesome', value: 'fontawesome' },
        { label: 'Bootstrap', value: 'bootstrap' },
    ];

    const library = useMemo(() => {
        return {
            fontawesome: {
                label: 'Font Awesome',
                styles: ['regular', 'solid', 'brands'],
                icons: fontAwesomeIcons,
            },
            bootstrap: {
                label: 'Font Awesome',
                styles: ['regular', 'fill'],
                icons: bootstrapIcons,
            },
        };
    }, []);

    const icons =
        iconLibrary !== 'all'
            ? library[iconLibrary]
            : { label: 'All Icons', icons: [...bootstrapIcons, ...fontAwesomeIcons] };

    const handleSearch = useMemo(
        () =>
            debounce((sq) => {
                const filteredIcons = searchQuery
                    ? icons.icons.filter((icon) => {
                        const label = icon.label.toLowerCase();
                        const terms = icon.terms
                            ? icon.terms.map((term) => term.toLowerCase())
                            : [];
                        return (
                            terms.some((term) => term.includes(sq.toLowerCase())) ||
                            label.includes(sq.toLowerCase())
                        );
                    })
                    : icons.icons;
                setSearchedIcons({ icons: filteredIcons });
            }, 600),
        [searchQuery]
    );

    const handleInputChange = (e) => {
        const sq = e.target.value;
        setSearchQuery(sq);
        handleSearch(sq);
    };

    useEffect(() => {
        setSearchedIcons({ icons: icons.icons.filter((icon, i) => i < 100) });
        setTimeout(() => {
            setSearchedIcons({ icons: icons.icons });
        }, 500);
    }, [iconLibrary]);

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

    return (
        <div className='bPlIconLibrary'>
            <PanelRow className={className}>
                <Label className=''>{label}</Label>

                <Flex align='center' gap={4} justify='right'>
                    {value && <div className='panel-icon' dangerouslySetInnerHTML={{ __html: value }} />}
                    <Button variant='primary' onClick={() => setIsOpen(true)} icon='edit' />
                </Flex>
            </PanelRow>

            {isOpen && (
                <div
                    className={`bPl-icon-library-main-wrapper ${isOpen ? 'isOpen' : ''}`}
                >
                    <div ref={iconRef} className='bPl-icon-library-wrapper'>
                        <div className='bPl-icon-library-header'>
                            <div className='bPl-icon-library-logo'>
                                <LogoSmall />
                                <h3>Icon Library</h3>
                            </div>
                            <div className='bPl-icon-library-closebtn'>
                                <XMarkIcon onClick={() => setIsOpen(false)} />
                            </div>
                        </div>
                        <div className='bPl-icon-library-body-main-wrapper'>
                            <div className='bPl-icon-library-sidebar-wrapper'>
                                <ul className='bPl-icon-menus'>
                                    {items.map((item, i) => (
                                        <li
                                            key={i}
                                            className={`${item.value === iconLibrary ? 'active' : ''
                                                }`}
                                            onClick={() => setIconLibrary(item.value)}
                                        >
                                            {item.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='bPl-icon-library-body-wrapper'>
                                {/* <div className='bPl-icon-library-body'> */}
                                <div className='bPl-icon-library-searchField'>
                                    <input
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                        type='text'
                                        className='bPl-icon-library-search-input'
                                        placeholder='Filter by name...'
                                    />
                                    <MagnifyingGlass className='bPl-icon-library-searchIcon' />
                                </div>
                                <div className='bPl-icon-library-iconsList'>
                                    {/* {icons.styles && (
                    <div className='bPl-icon-library-iconCategory'>
                      {icons.styles.map((category, i) => (
                        <span key={i} className='bPl-icon-singleCategory'>
                          {category}
                          <XMarkIcon height={15} />
                        </span>
                      ))}
                    </div>
                  )} */}
                                    <div className='bPl-icon-library-single-icon-wrapper'>
                                        {searchedIcons?.icons?.map((icon, i) => {
                                            const svgIcons = icon.svg;
                                            // console.log(svgIcons);

                                            return Object.keys(svgIcons).map((key, idx) => (
                                                <div

                                                    key={idx}
                                                    onClick={() => setSelectIcon(svgIcons[key])}
                                                    className={`bPl-icon-library-single-icon ${JSON.stringify(selectIcon) ===
                                                        JSON.stringify(svgIcons[key])
                                                        ? 'isActive'
                                                        : ''
                                                        } `}
                                                >
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: svgIcons[key] }}
                                                    ></span>
                                                    <div className='bPl-icon-label' title={icon.label}>
                                                        {icon.label}
                                                    </div>
                                                </div>
                                            ));
                                        })}
                                    </div>
                                </div>
                                {/* </div> */}
                            </div>
                        </div>
                        <div className='bPl-icon-library-footer'>
                            <button
                                className='bPl-icon-insert-btn'
                                onClick={() => {
                                    onChange(selectIcon);
                                    setIsOpen(false);
                                }}
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(IconLibrary);