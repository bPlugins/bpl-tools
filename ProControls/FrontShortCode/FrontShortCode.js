import { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import './FrontShortCode.scss';
import { Label } from '../../Components';

export const FrontShortCode = withSelect((select) => {
	return {
		currentPostType: select('core/editor').getCurrentPostType()
	};
})(({ postType, shortCode, currentPostType }) => {
	const tooltip = useRef(null);

	const handleCopyShortCode = e => {
		const input = e.target;
		input.select();
		input.setSelectionRange(0, 30);
		document.execCommand('copy');
		tooltip.current.innerHTML = __('Copied Successfully!', 'bplugins');
		setTimeout(() => {
			tooltip.current.innerHTML = __('Copy To Clipboard', 'bplugins');
		}, 1500);
	};

	return postType === currentPostType && <div className='bPlFrontShortCode'>
		<Label className='mb5'>{__('Copy the shortcode and use it anywhere.', 'bplugins')}</Label>

		<div className='bPlFrontShortCodeInput'>
			<input onClick={handleCopyShortCode} value={shortCode} />
			<span ref={tooltip} className='tooltip'>
				{__('Copy To Clipboard', 'bplugins')}
			</span>
		</div>
	</div>
});