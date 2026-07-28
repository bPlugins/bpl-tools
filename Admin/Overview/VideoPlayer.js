/**
	* VideoPlayer Component
	*
	* @props src (required): video URL (String)
	* @props width (optional): '100%' (String)
	* @props height (optional): 'auto' (String)
	* @props autoPlay (optional): false (Boolean)
	* @props muted (optional): false (Boolean)
	* @props loop (optional): false (Boolean)
	* @props poster (optional): null - poster image URL (String)
	* @props isYoutube (optional): false (Boolean)
	* @props title (optional): 'Video' - iframe title, used for YouTube sources (String)
	*/

import { useEffect, useRef, useState } from 'react';

import { playFillIcon, pauseFillIcon, playPauseIcon, playIcon, volumeMutedIcon, volumeOnIcon, fullscreenIcon } from '../utils/icons';
import { getYoutubeEmbedSrc } from '../utils/video';

const VideoPlayer = ({ src, width = '100%', height = 'auto', autoPlay = false, muted = false, loop = false, poster = null, isYoutube = false, title = 'Video' }) => {
	const videoRef = useRef(null)
	const previewVideoRef = useRef(null)
	const progressBarRef = useRef(null)
	const volumeBarRef = useRef(null)
	const containerRef = useRef(null)
	// const previewCanvasRef = useRef(null)

	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(1)
	const [isMuted, setIsMuted] = useState(muted)
	const [isDragging, setIsDragging] = useState(false)
	const [showControls, setShowControls] = useState(true)
	// const [previewTime, setPreviewTime] = useState(0)
	// const [showPreview, setShowPreview] = useState(false)
	// const [previewPosition, setPreviewPosition] = useState(0)

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		const handleLoadStart = () => setIsLoading(true)
		const handleCanPlay = () => setIsLoading(false)
		const handleLoadedMetadata = () => {
			setDuration(video.duration)
			// Setup preview video
			if (previewVideoRef.current) {
				previewVideoRef.current.src = src
				previewVideoRef.current.muted = true
			}
		}
		const handleTimeUpdate = () => {
			if (!isDragging) {
				setCurrentTime(video.currentTime)
			}
		}
		const handleEnded = () => {
			setIsPlaying(false)
		}

		// keep the overlay in sync when playback is driven by autoPlay or native controls
		const handlePlay = () => setIsPlaying(true)
		const handlePause = () => setIsPlaying(false)

		video.addEventListener('loadstart', handleLoadStart)
		video.addEventListener('canplay', handleCanPlay)
		video.addEventListener('loadedmetadata', handleLoadedMetadata)
		video.addEventListener('timeupdate', handleTimeUpdate)
		video.addEventListener('ended', handleEnded)
		video.addEventListener('play', handlePlay)
		video.addEventListener('pause', handlePause)

		return () => {
			video.removeEventListener('loadstart', handleLoadStart)
			video.removeEventListener('canplay', handleCanPlay)
			video.removeEventListener('loadedmetadata', handleLoadedMetadata)
			video.removeEventListener('timeupdate', handleTimeUpdate)
			video.removeEventListener('ended', handleEnded)
			video.removeEventListener('play', handlePlay)
			video.removeEventListener('pause', handlePause)
		}
	}, [isDragging, src])

	useEffect(() => {
		const handleKeyDown = (e) => {
			switch (e.key) {
				case ' ':
					e.preventDefault()
					togglePlay()
					break
				case 'f':
				case 'F':
					toggleFullscreen()
					break
				case 'm':
				case 'M':
					toggleMute()
					break
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const togglePlay = () => {
		const video = videoRef.current
		if (!video) return

		if (video.paused) {
			video.play()
			setIsPlaying(true)
		} else {
			video.pause()
			setIsPlaying(false)
		}
	}

	const handleProgressClick = (e) => {
		const rect = progressBarRef.current.getBoundingClientRect()
		const progress = (e.clientX - rect.left) / rect.width
		const time = progress * duration
		videoRef.current.currentTime = Math.max(0, Math.min(time, duration))
		setCurrentTime(time)
	}

	const handleProgressMouseDown = (e) => {
		setIsDragging(true)
		handleProgressClick(e)
	}

	// const handleProgressMouseMove = (e) => {
	//	if (!progressBarRef.current || !duration) return

	//	const rect = progressBarRef.current.getBoundingClientRect()
	//	const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
	//	const time = progress * duration
	//	const position = (e.clientX - rect.left)

	//	setPreviewTime(time)
	//	setPreviewPosition(position)
	//	setShowPreview(true)

	//	// Update preview video time
	//	if (previewVideoRef.current && previewVideoRef.current.readyState >= 2) {
	//	previewVideoRef.current.currentTime = time
	//	}
	// }

	// const handleProgressMouseEnter = () => {
	//	setShowPreview(true)
	// }

	// const handleProgressMouseLeave = () => {
	//	setShowPreview(false)
	// }

	const handleVolumeClick = (e) => {
		const rect = volumeBarRef.current.getBoundingClientRect()
		const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
		setVolume(newVolume)
		videoRef.current.volume = newVolume
		if (newVolume > 0) {
			setIsMuted(false)
			videoRef.current.muted = false
		}
	}

	const handleVolumeMouseDown = (e) => {
		setIsDragging(true)
		handleVolumeClick(e)
	}

	const toggleMute = () => {
		const video = videoRef.current
		if (!video) return

		video.muted = !video.muted
		setIsMuted(video.muted)
	}

	const toggleFullscreen = () => {
		const container = containerRef.current
		if (!container) return

		if (!document.fullscreenElement) {
			container.requestFullscreen()
		} else {
			document.exitFullscreen()
		}
	}

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	const progressPercentage = duration ? (currentTime / duration) * 100 : 0
	const volumePercentage = volume * 100

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (isDragging) {
				if (e.target.closest('.progress-bar')) {
					handleProgressClick(e)
				} else if (e.target.closest('.volume-bar')) {
					handleVolumeClick(e)
				}
			}
		}

		const handleMouseUp = () => {
			setIsDragging(false)
		}

		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging])

	return <div
		ref={containerRef}
		className="bPlVideoPlayer"
		style={{ width, height }}
		onMouseEnter={() => setShowControls(true)}
		onMouseLeave={() => setShowControls(!isPlaying)}
	>
		{isYoutube ? <div className='bPlVideoPlayerYoutube'>
			<iframe src={getYoutubeEmbedSrc(src, { autoplay: autoPlay })}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
				style={{ width, height }}
				title={title} />
		</div> : <>
			<video
				ref={videoRef}
				className="video-element"
				src={src}
				poster={poster}
				autoPlay={autoPlay}
				muted={muted}
				loop={loop}
				onClick={togglePlay}
				preload="metadata"
			>
				Your browser does not support the video tag.
			</video>

			{/* Hidden preview video for generating thumbnails */}
			<video
				ref={previewVideoRef}
				className="preview-video"
				muted
				preload="metadata"
				style={{ display: 'none' }}
			/>

			{/* Center Play Button */}
			{!isPlaying && (
				<div className="center-play-btn" onClick={togglePlay}>
					<div className="play-icon">
						{playFillIcon}
					</div>
				</div>
			)}
			{isPlaying && (
				<div className="center-play-btn pause" onClick={togglePlay}>
					<div className="play-icon">
						{pauseFillIcon}
					</div>
				</div>
			)}

			{/* Loading Spinner */}
			{isLoading && (
				<div className="loading-spinner">
					<div className="spinner"></div>
				</div>
			)}

			{/* Video Controls */}
			<div className={`video-controls ${showControls ? 'visible' : ''}`}>
				<button className="control-btn play-pause-btn" onClick={togglePlay}>
					{isPlaying ? playPauseIcon : playIcon}
				</button>

				<div className="time-display">
					<span className="current-time">{formatTime(currentTime)}</span>
					<span className="separator">/</span>
					<span className="duration">{formatTime(duration)}</span>
				</div>

				<div className="progress-container">
					{/* Preview Thumbnail */}
					{/* {showPreview && (
						<div
							className="progress-preview"
							style={{
								left: `${Math.max(60, Math.min(previewPosition, progressBarRef.current?.offsetWidth - 60))}px`
							}}
						>
							<div className="preview-thumbnail" key={formatTime(previewTime)}>
								<video
									className="preview-video-display"
									src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
									muted
									preload="metadata"
									width={120}
									height={68}
									onLoadedData={(e) => {
										e.target.currentTime = previewTime
									}}
								/>
								<div className="preview-time">{formatTime(previewTime)}</div>
							</div>
						</div>
					)} */}

					<div
						ref={progressBarRef}
						className="progress-bar"
						onClick={handleProgressClick}
						onMouseDown={handleProgressMouseDown}
					// onMouseMove={handleProgressMouseMove}
					// onMouseEnter={handleProgressMouseEnter}
					// onMouseLeave={handleProgressMouseLeave}
					>
						<div
							className="progress-filled"
							style={{ width: `${progressPercentage}%` }}
						/>
						<div
							className="progress-handle"
							style={{ left: `${progressPercentage}%` }}
						/>
					</div>
				</div>

				<div className="volume-container">
					<button className="control-btn volume-btn" onClick={toggleMute}>
						{isMuted || volume === 0 ? volumeMutedIcon : volumeOnIcon}
					</button>
					<div className="volume-slider">
						<div
							ref={volumeBarRef}
							className="volume-bar"
							onClick={handleVolumeClick}
							onMouseDown={handleVolumeMouseDown}
						>
							<div
								className="volume-filled"
								style={{ width: `${volumePercentage}%` }}
							/>
							<div
								className="volume-handle"
								style={{ left: `${volumePercentage}%` }}
							/>
						</div>
					</div>
				</div>

				<button className="control-btn fullscreen-btn" onClick={toggleFullscreen}>
					{fullscreenIcon}
				</button>
			</div>
		</>}
	</div>
}
export default VideoPlayer;