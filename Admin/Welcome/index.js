import { useState } from 'react';
import { withSelect } from '@wordpress/data';

import Button from '../../../../bpl-tools/Components/Button/Button';
import Changelog from '../../../../bpl-tools/Admin/Changelog';
import ProAds from '../../../../bpl-tools/Admin/ProAds';
import supportThumbnail from '../../../../bpl-tools/Admin/assets/image/support.png';
import { closeIcon, playIcon } from '../../../../bpl-tools/utils/icons';

import GettingStartedTabs from '../GettingStartedTabs';

const getYoutubeEmbedSrc = (url) => {
    const regRegular = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const regShort = /youtu\.be\/([^#\&\?]+)/;
    let videoId = '';
    const match = url.match(regRegular);
    if (match && match[2]?.length === 11) videoId = match[2];
    else {
        const shortMatch = url.match(regShort);
        if (shortMatch && shortMatch[1]?.length === 11) videoId = shortMatch[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url;
};

const PlusIcon = () => <svg viewBox='0 0 24 24' width={15} height={15} fill='none' stroke='currentColor' strokeWidth={2.4} strokeLinecap='round' strokeLinejoin='round'>
    <line x1='12' y1='5' x2='12' y2='19' />
    <line x1='5' y1='12' x2='19' y2='12' />
</svg>;

const CrownIcon = () => <svg viewBox='0 0 24 24' width={14} height={15} fill='none' stroke='currentColor' strokeWidth={1.8} strokeLinecap='round' strokeLinejoin='round'>
    <path d='M3 17l3-9 4 5 2-7 2 7 4-5 3 9' />
    <line x1='3' y1='21' x2='21' y2='21' />
</svg>;

const ArrowRightIcon = () => <svg viewBox='0 0 24 24' width={13} height={13} fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
    <line x1='5' y1='12' x2='19' y2='12' />
    <polyline points='12 5 19 12 12 19' />
</svg>;

const GridIcon = () => <svg viewBox='0 0 24 24' width={14} height={14} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='3' width='7' height='7' rx='1' />
    <rect x='14' y='3' width='7' height='7' rx='1' />
    <rect x='3' y='14' width='7' height='7' rx='1' />
    <rect x='14' y='14' width='7' height='7' rx='1' />
</svg>;

const APB_LAYOUTS = ['Grid', 'Masonry', 'Slider', 'Ticker'];

const Welcome = (props) => {
    const { name, version, slug, isPremium, media, pages, startButton, site, currentUser } = props;
    const { thumbnail, video, isYoutube } = media || {};

    const [showVideo, setShowVideo] = useState(false);

    const firstName = currentUser?.name ? currentUser.name.split(/\s+/)[0] : '';

    const helpItems = [
        {
            title: 'Need any Assistance?',
            description: 'Our Expert Support Team is always ready to help you out promptly.',
            link: 'https://bplugins.com/support',
            linkText: 'Contact Support',
            image: supportThumbnail
        },
        {
            titleIcon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 292 512' fill='#1877F2' width={18} height={18}>
                <path d='m66 299.3v212.7h116v-212.7h86.5l18-97.8h-104.5v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 0.4 37 1.2v-88.7c-14.3-3.9-49.3-7.9-69.5-7.9-106.9 0-156.2 50.5-156.2 159.4v42.1h-66v97.8z' />
            </svg>,
            title: 'Join Our Community',
            description: 'Get tutorials, plugin updates, feature announcements, and support from other WordPress users.',
            link: 'https://facebook.com/groups/1828495198556137',
            linkText: 'Join Now →'
        },
        {
            title: 'Request A Feature',
            description: 'Have an idea that would make Advanced Post Block even better? Let us know — we love hearing from you.',
            link: 'https://bplugins.com/support/',
            linkText: 'Submit Request →'
        },
        {
            title: 'Loving Advanced Post Block? ⭐',
            description: "We're a small team pouring our heart into this plugin — your honest review keeps us going and helps other WordPress creators discover it. It only takes 30 seconds, and it means the world to us. 🙏",
            link: slug ? `https://wordpress.org/support/plugin/${slug}/reviews/#new-post` : '',
            linkText: 'Leave a Review'
        }
    ];

    return <div className='bp3dWelcomeLayout bp3dWelcomeLayoutV3'>
        <div className='bp3dHeroRow'>
            <GettingStartedTabs pages={pages} />

            <div className='bp3dWelcomeCard bPlDashboardCard'>
                <div className='bp3dWelcomeCardBody'>
                    <div className='bp3dWelcomeStatusRow'>
                        <span className='bp3dWelcomeStatus'>
                            <span className='bp3dWelcomeStatusDot' aria-hidden='true' />
                            Plugin active
                        </span>

                        <span className={`bp3dWelcomePlan ${isPremium ? 'isPro' : 'isFree'}`}>
                            {isPremium && <CrownIcon />}
                            {isPremium ? 'Pro Plan' : 'Free Plan'}
                        </span>

                        {version && <span className='bp3dWelcomeVer'>v{version}</span>}
                    </div>

                    {name && <h2>Welcome to {name}</h2>}

                    <p className='bp3dWelcomeTagline'>
                        {firstName ? <>Hi <strong>{firstName}</strong>, design stunning post layouts — grids, masonry, sliders, tickers — in minutes, no code required.</> : 'Design stunning post layouts — grids, masonry, sliders, tickers — in minutes, no code required.'}
                    </p>

                    {thumbnail && <div className='bp3dWelcomeBanner'>
                        <img src={thumbnail} alt={name} />

                        {video && <button className='playButton' onClick={() => setShowVideo(true)} aria-label='Play product walkthrough'>
                            {playIcon}
                        </button>}

                        {video && <span className='bp3dWelcomeBannerCaption'>Watch quick start · 2 min</span>}
                    </div>}

                    <div className='bp3dWelcomeFormats'>
                        <span className='bp3dWelcomeFormatsLabel'>Layouts</span>
                        {APB_LAYOUTS.map((f) => <span key={f} className='bp3dWelcomeFormat'>{f}</span>)}
                    </div>

                    <div className='bp3dWelcomeButtons'>
                        {startButton?.url && startButton?.label && <Button
                            className='bp3dWelcomeBtn bp3dWelcomeBtnPrimary'
                            href={site?.url ? `${site.url}/${startButton.url}` : startButton.url}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <PlusIcon />
                            Build Your First Layout
                        </Button>}

                        <Button className='bp3dWelcomeBtn bp3dWelcomeBtnSecondary' href='#/demos'>
                            <GridIcon />
                            View Demos
                        </Button>

                        {!isPremium && <a className='bp3dWelcomeBtnGhost' href='#pricing'>
                            <CrownIcon />
                            Upgrade to Pro
                            <ArrowRightIcon />
                        </a>}
                    </div>
                </div>
            </div>
        </div>

        <div className='bp3dContentRow'>
            <Changelog {...props} />
            {!isPremium && <ProAds {...props} />}
        </div>

        <div className='bp3dHelpRow'>
            {helpItems.map((item, index) => item.link && <div key={index} className='bp3dHelpCard bPlDashboardCard'>
                {item.image && <figure>
                    <img src={item.image} alt={item.title} />
                </figure>}

                <h4>{item.title} {item.titleIcon}</h4>

                <p>{item.description}</p>

                <Button href={item.link} target='_blank' rel='noopener noreferrer'>{item.linkText}</Button>
            </div>)}
        </div>

        {showVideo && video && <div className='bPlVideoModal'>
            <div className='bPlVideoModalContent'>
                <button className='closeModal' onClick={() => setShowVideo(false)} aria-label='Close video'>
                    {closeIcon}
                </button>

                {isYoutube ? <iframe
                    key={video}
                    src={getYoutubeEmbedSrc(video)}
                    title='Product walkthrough'
                    frameBorder={0}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                /> : <video key={video} src={video} autoPlay controls playsInline />}
            </div>

            <div className='bPlVideoModalOverlay' onClick={() => setShowVideo(false)} />
        </div>}
    </div>;
};

export default withSelect((select) => {
    const core = select('core');
    return {
        site: core.getSite?.(),
        currentUser: core.getCurrentUser?.()
    };
})(Welcome);
