import './style.scss';

const Loading = ({ className = '', text = 'Loading...', orientation = 'horizontal', iconSize = '2rem', iconThickness = '4px', textSize = '18px' }) => {
	return <div className={`bPlLoading ${className}`}>
		<div className={`loadingContent ${orientation}`}>
			<div className='loadingSpinner' style={{ width: iconSize, height: iconSize, borderWidth: iconThickness }}></div>

			{text && <p className='loadingText' style={{ fontSize: textSize }}>{text}</p>}
		</div>
	</div>
}
export default Loading;
