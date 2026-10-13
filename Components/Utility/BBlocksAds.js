/**
	* BBlocksAds Component
	* Renders a promotional line linking to the bBlocks plugin bundle.
	*/

import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';

const BBlocksAds = () => {
	return <span>{createInterpolateElement(__('Need more block like this? Checkout the bundle ➡ <a>bBlocks</a>'), {
		a: <a href='https://wordpress.org/plugins/b-blocks' target='_blank' rel='noopener noreferrer' />
	})}</span>;
}
export default BBlocksAds;