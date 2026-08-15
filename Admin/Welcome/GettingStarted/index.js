import { useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';

import VideoPlayer from '../../Overview/VideoPlayer';
import { closeIcon } from '../../utils/icons';

import './style.scss';

/**
 * Tabbed getting-started guide. Renders tab buttons and a sliding step list.
 *
 * @param {object}		props
 * @param {object[]}	props.tabs		- Tab definitions: [{key, label, icon?, video?, isYoutube?, docs?, steps: [{num, title, body, link?: {url, label}}]}]
 * `body` is rendered as HTML via dangerouslySetInnerHTML.
 * A tab with `video` gets a "Watch Video" button that slides in next to the docs link and opens the video in a modal.
 * A tab with `docs` overrides the bottom documentation link with its own tab-specific URL and heading.
 * @param {object}		[props.pages]	- {docs?} — URL for the "Open Documentation" link at the bottom
 */
const GettingStarted = ({ tabs = [], pages }) => {
	const [active, setActive] = useState(0);
	const [direction, setDirection] = useState(1); // 1 = moved right, -1 = moved left
	const [showVideo, setShowVideo] = useState(false);

	if (!tabs?.length) return null;

	const activeTab = tabs[active] || {};
	const { video, docs: tabDocs, label } = activeTab;

	const docsUrl = tabDocs || pages?.docs || 'https://bplugins.com/docs/';

	const changeTab = index => {
		if (index === active) return;

		setShowVideo(false);
		setDirection(index > active ? 1 : -1);
		setActive(index);
	};

	return <div className='bPlDashboardGettingStarted bPlDashboardCard'>
		<div className='header'>
			<h2>{__('Getting Started')}</h2>
			<p>{__('Pick how you\'d like to start with the plugin - the steps below adapt to your workflow.')}</p>
		</div>

		<div className='tabsNav' role='tablist'>
			{tabs.map((tab, index) => <button
				key={tab.key}
				type='button'
				role='tab'
				aria-selected={active === index}
				className={`tab ${active === index ? 'isActive' : ''}`}
				onClick={() => changeTab(index)}
			>
				{tab.icon && <span className='tabIcon'>{tab.icon}</span>}
				<span>{tab.label}</span>
			</button>)}
		</div>

		<div className='tabsViewport'>
			<div className='tabsTrack' style={{ transform: `translateX(-${active * 100}%)` }}>
				{tabs.map(tab => <div
					key={tab.key}
					className='tabPanel'
					role='tabpanel'
					aria-hidden={tabs[active].key !== tab.key}
				>
					<div className='steps'>
						{tab.steps.map(step => <div key={step.num} className='step'>
							<span className='stepNum'>{step.num}</span>

							<div className='stepBody'>
								<h3>{step.title}</h3>
								<p dangerouslySetInnerHTML={{ __html: step.body }} />
								{step.link && <a className='stepLink' href={step.link.url}>{step.link.label} →</a>}
							</div>
						</div>)}
					</div>
				</div>)}
			</div>
		</div>

		<div className='docs'>
			<div>
				<h3>{tabDocs ? sprintf(__('Read the %s Documentation'), label) : __('Read the Full Documentation')}</h3>
				{!tabDocs && <p>{__('Browse guides, settings reference, and examples for every feature.')}</p>}
			</div>

			<div className='docsActions'>
				<a className='docsBtn' href={docsUrl} target='_blank' rel='noopener noreferrer'>{__('Read Documentation →')}</a>

				{video && <button
					key={activeTab.key}
					type='button'
					className={`videoBtn ${direction > 0 ? 'fromRight' : 'fromLeft'}`}
					onClick={() => setShowVideo(true)}
					aria-label={__('Watch Tutorial')}
				>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 668 534'>
						<path fill='#ff0333' d='m544.3 7.3c-63-4.6-134-7-210.3-7-76.3 0-147.3 2.4-210.3 7-16.6 1.3-32.8 5.7-47.8 13-15 7.2-28.5 17.2-39.8 29.4-11.3 12.3-20.2 26.5-26.3 42-6 15.5-9.1 32-9.1 48.6v253.4c-0.1 16.6 3 33.2 9 48.7 6.1 15.6 15 29.8 26.3 42.1 11.3 12.2 24.8 22.3 39.8 29.5 15 7.3 31.2 11.7 47.9 13 63 4.7 133.3 7 210.3 7 77 0 147.3-2.3 210.3-7 16.7-1.3 32.9-5.7 47.9-13 15-7.2 28.5-17.3 39.8-29.5 11.3-12.3 20.2-26.5 26.3-42.1 6-15.5 9.1-32.1 9-48.7v-253.4c0-16.6-3.1-33.1-9.1-48.6-6.1-15.5-15-29.7-26.3-42-11.3-12.2-24.8-22.2-39.8-29.4-15-7.3-31.2-11.7-47.8-13z' />
						<path fill='#fff' d='m267.3 196.3v141.4c0 2.9 0.8 5.9 2.3 8.4 1.5 2.6 3.6 4.7 6.2 6.2 2.6 1.4 5.5 2.2 8.5 2.1 2.9 0 5.8-0.9 8.4-2.4l117.6-70.7c2.4-1.5 4.4-3.6 5.8-6.1 1.4-2.5 2.1-5.3 2.1-8.2 0-2.9-0.7-5.7-2.1-8.2-1.4-2.5-3.4-4.6-5.8-6.1l-117.6-70.7c-2.6-1.5-5.5-2.4-8.4-2.4-3-0.1-5.9 0.7-8.5 2.1-2.6 1.5-4.7 3.6-6.2 6.2-1.5 2.5-2.3 5.5-2.3 8.4z' />
					</svg>
					{__('Watch Tutorial')}
				</button>}
			</div>
		</div>

		{showVideo && video && <div className='bPlVideoModal'>
			<div className='bPlVideoModalContent'>
				<button className='closeModal' onClick={() => setShowVideo(false)}>
					{closeIcon}
				</button>

				<VideoPlayer
					src={video}
					isYoutube={true}
					autoPlay={true}
				/>
			</div>

			<div className='bPlVideoModalOverlay' onClick={() => setShowVideo(false)} />
		</div>}
	</div>;
};

export default GettingStarted;
