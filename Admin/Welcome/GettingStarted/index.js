import { useState } from 'react';
import { __ } from '@wordpress/i18n';

import './style.scss';

/**
 * Tabbed getting-started guide. Renders tab buttons and a sliding step list.
 *
 * @param {object}		props
 * @param {object[]}	props.tabs		- Tab definitions: [{key, label, icon?, steps: [{num, title, body, link?: {url, label}}]}]
 * `body` is rendered as HTML via dangerouslySetInnerHTML.
 * @param {object}		[props.pages]	- {docs?} — URL for the "Open Documentation" link at the bottom
 */
const GettingStarted = ({ tabs = [], pages }) => {
	const [active, setActive] = useState(0);

	if (!tabs?.length) return null;

	const docsUrl = pages?.docs || 'https://bplugins.com/docs/';

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
				onClick={() => setActive(index)}
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
				<h3>{__('Read the Full Documentation')}</h3>
				<p>{__('Browse guides, settings reference, and examples for every feature.')}</p>
			</div>

			<a className='docsBtn' href={docsUrl} target='_blank' rel='noopener noreferrer'>{__('Open Documentation →')}</a>
		</div>
	</div>;
};

export default GettingStarted;
