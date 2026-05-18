import { useState } from 'react';

const newApbUrl = 'post-new.php?post_type=apb';
const apbListUrl = 'edit.php?post_type=apb';

const tabs = [
    {
        key: 'shortcode',
        label: 'ShortCode',
        icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
            <polyline points='16 18 22 12 16 6' />
            <polyline points='8 6 2 12 8 18' />
        </svg>,
        steps: [
            {
                num: 1,
                title: 'Create a Post Layout',
                body: 'Go to Advanced Posts → Add New ShortCode, then design your grid / masonry / slider layout.',
                link: { url: newApbUrl, label: 'Add New Layout' }
            },
            {
                num: 2,
                title: 'Copy the Shortcode',
                body: 'Open the ShortCode list — the shortcode (e.g. [apb id="123"]) is shown next to each entry.',
                link: { url: apbListUrl, label: 'View All Layouts' }
            },
            {
                num: 3,
                title: 'Paste It Anywhere',
                body: 'Drop the shortcode into any post, page, widget area, or theme template to render the layout.'
            }
        ]
    },
    {
        key: 'gutenberg',
        label: 'Gutenberg',
        icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='currentColor'>
            <path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14H7v-2h4v2zm0-4H7v-2h4v2zm0-4H7V6h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V6h4v2z' />
        </svg>,
        steps: [
            {
                num: 1,
                title: 'Open the Block Editor',
                body: 'Edit any post or page where you want the post layout to appear.'
            },
            {
                num: 2,
                title: 'Insert the Advanced Posts Block',
                body: 'Click the + (Add block) button, search "Advanced Posts" under the APBlock category, and insert it.'
            },
            {
                num: 3,
                title: 'Configure Inline',
                body: 'Pick a layout (Grid · Masonry · Slider · Ticker), choose post types and filters, and tune styles from the sidebar.'
            }
        ]
    },
    {
        key: 'elementor',
        label: 'Elementor',
        icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='currentColor'>
            <path d='M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 17H6V7h2v10zm5 0h-2V7h2v10zm5 0h-2V7h2v10z' />
        </svg>,
        steps: [
            {
                num: 1,
                title: 'Create a Layout in WP first',
                body: 'Build the post layout as a ShortCode entry — it carries the design across editors.',
                link: { url: newApbUrl, label: 'Add New Layout' }
            },
            {
                num: 2,
                title: 'Open the Elementor Editor',
                body: 'Edit any page in Elementor where you want the layout.'
            },
            {
                num: 3,
                title: 'Use the ShortCode Widget',
                body: 'Drop Elementor\'s ShortCode widget into a section and paste [apb id="X"] — your layout renders instantly.'
            }
        ]
    },
    {
        key: 'theme',
        label: 'Theme / PHP',
        icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
            <polyline points='4 17 10 11 4 5' />
            <line x1='12' y1='19' x2='20' y2='19' />
        </svg>,
        steps: [
            {
                num: 1,
                title: 'Build the Layout',
                body: 'Create the ShortCode entry as usual, then copy its ID.',
                link: { url: apbListUrl, label: 'Manage Layouts' }
            },
            {
                num: 2,
                title: 'Drop into a Template File',
                body: 'In any theme template, call <code>echo do_shortcode("[apb id=\\"123\\"]");</code> where you want the layout.'
            },
            {
                num: 3,
                title: 'Style if Needed',
                body: 'Wrap the call in your own container to control width, spacing, or background per template.'
            }
        ]
    }
];

const GettingStartedTabs = ({ pages }) => {
    const [active, setActive] = useState(0);
    const docsUrl = pages?.docs || 'https://bplugins.com/docs/advanced-post-block/';

    return <div className='bp3dGettingStarted bp3dGsTabbed bPlDashboardCard'>
        <div className='bp3dGsHeader'>
            <h2>Getting Started</h2>
            <p>Pick how you'd like to embed your post layout — the steps below adapt to your editor.</p>
        </div>

        <div className='bp3dGsTabsNav' role='tablist'>
            {tabs.map((tab, index) => (
                <button
                    key={tab.key}
                    type='button'
                    role='tab'
                    aria-selected={active === index}
                    className={`bp3dGsTab ${active === index ? 'isActive' : ''}`}
                    onClick={() => setActive(index)}
                >
                    <span className='bp3dGsTabIcon'>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        <div className='bp3dGsTabsViewport'>
            <div className='bp3dGsTabsTrack' style={{ transform: `translateX(-${active * 100}%)` }}>
                {tabs.map((tab) => (
                    <div key={tab.key} className='bp3dGsTabPanel' role='tabpanel' aria-hidden={tabs[active].key !== tab.key}>
                        <div className='bp3dGsSteps'>
                            {tab.steps.map((step) => (
                                <div key={step.num} className='bp3dGsStep'>
                                    <span className='bp3dGsStepNum'>{step.num}</span>

                                    <div className='bp3dGsStepBody'>
                                        <h3>{step.title}</h3>
                                        <p dangerouslySetInnerHTML={{ __html: step.body }} />
                                        {step.link && <a className='bp3dGsLink' href={step.link.url}>{step.link.label} →</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className='bp3dGsDocs'>
            <div>
                <h3>Read the Full Documentation</h3>
                <p>Browse guides, settings reference, and examples for every layout and option.</p>
            </div>

            <a className='bp3dGsDocsBtn' href={docsUrl} target='_blank' rel='noopener noreferrer'>Open Documentation →</a>
        </div>
    </div>;
};

export default GettingStartedTabs;
