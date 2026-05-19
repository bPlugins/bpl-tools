import { useEffect, useMemo, useRef, useState } from 'react';

import Button from '../../Components/Button/Button';
import Loading from '../../Components/Loading/Loading';

import './style.scss';

export function slideDown(el, duration = 300) {
	el.style.removeProperty('display');
	let display = window.getComputedStyle(el).display;
	if (display === 'none') display = 'block';
	el.style.display = display;

	let height = el.offsetHeight;
	el.style.overflow = 'hidden';
	el.style.height = 0;

	el.offsetHeight;

	el.style.transition = `height ${duration}ms ease`;
	el.style.height = height + 'px';

	window.setTimeout(() => {
		el.style.removeProperty('height');
		el.style.removeProperty('overflow');
		el.style.removeProperty('transition');
	}, duration);
}

export function slideUp(el, duration = 300) {
	el.style.height = el.offsetHeight + 'px';
	el.style.overflow = 'hidden';
	el.offsetHeight;

	el.style.transition = `height ${duration}ms ease`;
	el.style.height = 0;

	window.setTimeout(() => {
		el.style.display = 'none';
		el.style.removeProperty('height');
		el.style.removeProperty('overflow');
		el.style.removeProperty('transition');
	}, duration);
}

export function slideToggle(el, duration = 300) {
	if (window.getComputedStyle(el).display === 'none') {
		return slideDown(el, duration);
	}
	return slideUp(el, duration);
}

const searchIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
	<path d='M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z' />
</svg>;

const angelDownIcon = <svg className='angelDown' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
	<path d='M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z' />
</svg>

const warningIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'>
	<path d='M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 384C302.3 384 288 398.3 288 416C288 433.7 302.3 448 320 448C337.7 448 352 433.7 352 416C352 398.3 337.7 384 320 384zM320 192C301.8 192 287.3 207.5 288.6 225.7L296 329.7C296.9 342.3 307.4 352 319.9 352C332.5 352 342.9 342.3 343.8 329.7L351.2 225.7C352.5 207.5 338.1 192 319.8 192z' />
</svg>

/**
 * Demos Component
 * Renders a searchable and categorised list of product demos with an iframe/image preview.
 *
 * @param {object} props - Component props
 * @param {object} props.demoInfo - Demo configuration {allInOneLabel, allInOneLink, demos}
 * @returns {JSX.Element}
 */
const Demos = (props) => {
	const { isPremium, demoInfo } = props;
	const { allInOneLabel, allInOneLink, demos } = demoInfo;

	const [activeDemo, setActiveDemo] = useState(demos[0]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [activeItem, setActiveItem] = useState(demoInfo.demos[0].children?.[0] || demoInfo.demos[0]);
	const [expandedId, setExpandedId] = useState(demoInfo.demos[0].title);
	const [searchQuery, setSearchQuery] = useState('');

	const onAccordionChange = (index) => {
		setIsLoading(true);
		setActiveDemo(demos[index]);
		setActiveIndex(index);
		setExpandedId(demos[index].title);
		setActiveItem(demos[index]?.children?.[0])
	};

	const onItemChange = (item) => {
		setIsLoading(true);
		if (item.url && item.url !== '#') {
			setActiveItem(item);
		}
	};

	// Filter the demos by search
	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) return demoInfo.demos;
		const query = searchQuery.toLowerCase();

		return demoInfo.demos.filter(item => {
			const matchParent = item.title.toLowerCase().includes(query);
			const matchChildren = item.children?.some(child =>
				child.title.toLowerCase().includes(query)
			);
			if (matchChildren && !matchParent) setExpandedId(item.title);
			return matchParent || matchChildren;
		}).map(item => {
			if (item.children) {
				return {
					...item,
					children: item.children.filter(child =>
						child.title.toLowerCase().includes(query) || item.title.toLowerCase().includes(query)
					)
				};
			}
			return item;
		});
	}, [searchQuery]);

	// Image Effect
	const imgWrapRef = useRef(null);
	const imgRef = useRef(null);
	useEffect(() => {
		const wrapEl = imgWrapRef.current;
		const imgEl = imgRef.current;
		const wrapperHeight = wrapEl?.clientHeight;
		const imgHeight = imgEl?.scrollHeight;

		function handleMouseOver() {
			imgEl.style.transform = `translateY(-${Number(imgHeight) - parseInt(wrapperHeight)}px)`;
		}
		function handleMouseOut() {
			imgEl.style.transform = `translateY(0px)`;
		}

		if (wrapEl && imgEl && Number(imgHeight) > parseInt(wrapperHeight)) {
			wrapEl.addEventListener('mouseover', handleMouseOver);
			wrapEl.addEventListener('mouseout', handleMouseOut);
		}

		return () => {
			if (wrapEl && imgEl) {
				wrapEl.removeEventListener('mouseover', handleMouseOver);
				wrapEl.removeEventListener('mouseout', handleMouseOut);
			}
		};
	}, [activeDemo, activeIndex, isLoading]);

	return <div className='bPlDashboardDemos bPlDashboardCard'>
		<div className='sidebar'>
			<div className='sidebarHeader'>
				<p>Search</p>

				<div className='search'>
					{searchIcon}

					<input type='text' placeholder='Search demo...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
				</div>

				<div className='bPlDashboardButtons'>
					{!isPremium && <Button href='#pricing'>Buy Now</Button>}

					{allInOneLabel && <Button href={allInOneLink} target='_blank' variant='secondary'>{allInOneLabel}</Button>}
				</div>
			</div>

			<div className='sidebarList'>
				{filteredData.length > 0 ?
					filteredData.map((item, index) => {
						const { icon, title, url, children } = item;
						const hasChildren = children && children.length > 0;
						const isExpanded = expandedId === title;

						return <div key={index} className='demoItem'>
							{hasChildren ?
								<div className={`accordion ${isExpanded ? 'expanded' : ''}`}>
									<button onClick={() => onAccordionChange(index)} className={`parentDemo ${isExpanded ? 'active' : ''}`}>
										{'string' === typeof icon ?
											<span className='icon' dangerouslySetInnerHTML={{ __html: icon }} /> :
											(icon ? icon : null)}

										<span className='text-sm font-semibold'>{title}</span>

										{angelDownIcon}
									</button>

									<ul className={isExpanded ? 'expanded' : ''} ref={(el) => {
										if (el) {
											if (isExpanded) {
												if ('block' !== el.style.display) {
													slideDown(el);
												}
											} else {
												slideUp(el);
											}
										}
									}}>
										{children.map((child, cIdx) => <li key={cIdx} className={activeItem.url === child.url ? 'active' : ''} onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();

											onItemChange(child);
										}}>
											{child.title}
										</li>)}
									</ul>
								</div> :
								<button className={`parentDemo ${activeItem.url === url ? 'active' : ''}`} onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();

									onItemChange(item);
									setExpandedId(null);
								}}>
									{'string' === typeof icon ?
										<span className='icon' dangerouslySetInnerHTML={{ __html: icon }} /> :
										(icon ? icon : null)}

									<span>{title}</span>
								</button>
							}
						</div>
					}) :
					<div className='notFound'>
						{warningIcon}
						<p className='text-sm text-gray-500'>No matching results</p>
					</div>
				}
			</div>
		</div>

		{/* Right Content - Demo Preview */}
		<div className='main'>
			{/* Demo Header */}
			<div className='mainHeader'>
				<div className='headerInfo'>
					<h3>{expandedId ? `${activeDemo?.title || ''} - ` : ''}{activeItem?.title || ''}</h3>
				</div>

				<div className='bPlDashboardButtons'>
					{!isPremium && <Button href='#pricing'>Buy Now</Button>}

					{allInOneLabel && <Button href={allInOneLink} target='_blank' variant='secondary'>{allInOneLabel}</Button>}
				</div>
			</div>

			{/* Demo Preview */}
			<div className='canvas'>
				{isLoading && <Loading text='Demo Loading...' orientation='vertical' />}

				{activeItem.type === 'iframe' ?
					<iframe
						src={activeItem.url}
						title={`${activeItem.title} Demo`}
						onLoad={() => setIsLoading(false)}
						sandbox='allow-scripts allow-same-origin allow-popups allow-forms'
					/> :
					<div className='canvasImg' ref={imgWrapRef}>
						<img src={activeItem.url} alt={`${activeItem.title} Demo`} onLoad={() => setIsLoading(false)} ref={imgRef} />
					</div>
				}
			</div>
		</div>
	</div >
};
export default Demos;