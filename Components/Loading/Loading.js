/**
	* Loading Component
	*
	* @props className (optional): '' (String)
	* @props text (optional): 'Loading...' (String)
	* @props orientation (optional): 'horizontal' (String)
	* @props iconSize (optional): '2rem' (String)
	* @props iconThickness (optional): '4px' (String)
	* @props textSize (optional): '18px' (String)
	*/

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
