import { useState, useRef } from 'react';
import { __ } from '@wordpress/i18n';

import useModalDismiss from './useModalDismiss';
import { playFillIcon, closeIcon } from '../utils/icons';

/**
 * Extract a YouTube video id from the common URL shapes.
 *
 * @param {string} url
 * @return {string} The 11-ish char id, or '' when the URL is not recognised.
 */
export const youtubeId = (url = '') => {
	const patterns = [
		/youtu\.be\/([\w-]+)/i,
		/youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/i,
		/youtube\.com\/embed\/([\w-]+)/i,
		/youtube\.com\/shorts\/([\w-]+)/i
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return match[1];
		}
	}

	return '';
};

/**
 * Resolve a step's video against the plugin-wide `media` fallback.
 *
 * A step may declare its own `video` — usually a short "how it works" clip that
 * is a different asset from the marketing video on the Welcome page.
 *
 * The fallback is **opt-in**, because a wizard normally wants the video on the
 * welcome step only. Falling back whenever a step omitted `video` would put the
 * same clip on every screen.
 *
 *   video: {url: '…'}  → that clip
 *   video: true        → fall back to media.video
 *   video: {poster:'…'}→ fall back to media.video, with these overrides
 *   (omitted)          → no video on this step
 *
 * @param {object|boolean} [stepVideo] - {url?, isYoutube?, poster?, title?} or true
 * @param {object}         [media]     - {video?, isYoutube?, thumbnail?}
 * @return {object|null} Normalised video descriptor, or null when there is none.
 */
export const resolveVideo = (stepVideo, media) => {
	if (!stepVideo) {
		return null;
	}

	const overrides = true === stepVideo ? {} : stepVideo;

	if (overrides.url) {
		return { poster: media?.thumbnail || '', ...overrides };
	}

	if (media?.video) {
		return {
			url: media.video,
			isYoutube: !!media.isYoutube,
			poster: media.thumbnail || '',
			title: '',
			...overrides
		};
	}

	return null;
};

/**
 * Step media block — poster thumbnail that opens the clip in a modal.
 *
 * The thumbnail is a facade: nothing is embedded, and YouTube is not contacted,
 * until the user actually asks to watch. Closing the modal unmounts the player,
 * which is what stops playback.
 *
 * @param {object} props
 * @param {object} props.video  - {url, isYoutube?, poster?, title?}
 * @param {string} [props.name] - Plugin name, used for alt text
 */
const Video = ({ video, name = '' }) => {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef(null);
	const closeRef = useRef(null);

	const close = () => {
		setIsOpen(false);
		// Send focus back to the thumbnail the user came from.
		triggerRef.current?.focus();
	};

	useModalDismiss(isOpen, close, closeRef);

	if (!video?.url) {
		return null;
	}

	const { url, isYoutube, poster, title } = video;
	const label = title || (name ? `${name} — video tutorial` : __('Video tutorial'));
	const id = isYoutube ? youtubeId(url) : '';

	// An unrecognised YouTube URL would build a broken embed — better to drop
	// the media block than render a dead frame.
	if (isYoutube && !id) {
		return null;
	}

	const thumbnail = poster || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');

	return <>
		<div className='bPlOnboardingVideo'>
			<button
				type='button'
				ref={triggerRef}
				className={`videoFacade ${thumbnail ? '' : 'noPoster'}`}
				onClick={() => setIsOpen(true)}
				aria-label={`${label} — ${__('play video')}`}
			>
				{thumbnail && <img src={thumbnail} alt={label} loading='lazy' />}
				<span className='videoPlay'>{playFillIcon}</span>
			</button>
		</div>

		{isOpen && <div className='bPlVideoModal' role='dialog' aria-modal='true' aria-label={label}>
			{/* Sibling of the player, so it pins to the screen corner rather
			    than to the video frame. */}
			<button type='button' ref={closeRef} className='closeModal' onClick={close} aria-label={__('Close video')}>
				{closeIcon}
			</button>

			<div className='bPlVideoModalContent'>
				{isYoutube
					? <iframe
						src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
						title={label}
						frameBorder={0}
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						allowFullScreen
					/>
					: <video src={url} poster={poster || undefined} autoPlay controls playsInline />}
			</div>

			<div className='bPlVideoModalOverlay' onClick={close} />
		</div>}
	</>;
};
export default Video;
