import { useEffect, useRef, useState } from 'react';

import Button from '../../Components/Button/Button';
import Loading from '../../Components/Loading/Loading';

import './ListDemos.scss';

const Demos = (props) => {
	const { demoInfo, children } = props;
	const { title, description, allInOneLabel, allInOneLink, demos } = demoInfo;

	const [activeDemo, setActiveDemo] = useState(demos[0]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const handleDemoChange = (index) => {
		setIsLoading(true);
		setActiveDemo(demos[index]);
		setActiveIndex(index);
	};

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

	return <div className='bPlDashboardListDemos'>
		{/* Left Sidebar - Demo Tabs */}
		<div className='sidebar'>
			<div className='sidebarHeader'>
				<div>
					{title && <h2 className='wp-block-heading' dangerouslySetInnerHTML={{ __html: title }} />}
					{description && <p dangerouslySetInnerHTML={{ __html: description }} />}
				</div>

				<div className='bPlDashboardButtons'>
					{children}

					{allInOneLabel && <Button href={allInOneLink} target='_blank' variant='secondary'>{allInOneLabel}</Button>}
				</div>
			</div>

			<div className='sidebarList'>
				{demos.map((demo, index) => {
					const { icon, title, description, category } = demo;

					const isActive = activeIndex === index;

					return <button key={index} className={isActive ? 'active' : ''} onClick={() => handleDemoChange(index)}>
						{icon && <div className='iconBox' dangerouslySetInnerHTML={{ __html: icon }} />}

						<div className='texts'>
							{title && <h4>{title}</h4>}

							{description && <p>{description}</p>}

							{category && <span className='category'>{category}</span>}
						</div>

						{/* {isActive && <div className='externalIcon'>{externalIcon}</div>} */}
					</button>
				})}
			</div>
		</div>

		{/* Right Content - Demo Preview */}
		<div className='main'>
			{/* Demo Header */}
			<div className='mainHeader'>
				<div className='headerInfo'>
					{activeDemo.title && <h3>{activeDemo.title}</h3>}
					{activeDemo.description && <p>{activeDemo.description}</p>}
				</div>

				<div className='bPlDashboardButtons'>
					{children}

					{allInOneLabel && <Button href={allInOneLink} target='_blank' variant='secondary'>{allInOneLabel}</Button>}
				</div>
			</div>

			{/* Demo Preview */}
			<div className='canvas'>
				{isLoading && <Loading text='Demo Loading...' orientation='vertical' />}

				{activeDemo.type === 'iframe' ?
					<iframe
						src={activeDemo.url}
						title={`${activeDemo.title} Demo`}
						loading={isLoading}
						onLoad={() => setIsLoading(false)}
						sandbox='allow-scripts allow-same-origin allow-popups allow-forms'
					/> :
					<div className='canvasImg' ref={imgWrapRef}>
						<img src={activeDemo.url} alt={`${activeDemo.title} Demo`} onLoad={() => setIsLoading(false)} ref={imgRef} />
					</div>
				}
			</div>

			{/* Demo Footer */}
			<div className='mainFooter'>
				<span>Preview of <strong>{activeDemo.title}</strong></span>
			</div>
		</div>
	</div>
};
export default Demos;