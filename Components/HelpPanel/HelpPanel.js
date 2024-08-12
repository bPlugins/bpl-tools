import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { bookIcon, headsetIcon, starIcon, rightArrowIcon } from '../../utils/icons';
import './HelpPanel.scss';

export const HelpPanel = ({ slug, docsLink }) => {
	return <PanelBody className='bPlPanelBody bPlHelpPanel' title={__('Help', 'bplugins')} initialOpen={false}>

		<div className='helpItems'>
			{docsLink && <a href={docsLink} target='_blank' rel='noreferrer'>
				{bookIcon}
				<p>{__('Read Documentation', 'bplugins')}</p>
			</a>}

			<a href='https://bplugins.com/support' target='_blank' rel='noreferrer'>
				{headsetIcon}
				<p>{__('Contact Support', 'bplugins')}</p>
			</a>

			{slug && <a href={`https://wordpress.org/support/plugin/${slug}/reviews/#new-post`} target='_blank' rel='noreferrer'>
				{starIcon}
				<p>{__('Rate Plugin', 'bplugins')}</p>
			</a>}

			<a href='https://bplugins.com/products' target='_blank' rel='noreferrer'>
				{rightArrowIcon}
				<p>{__('Other Plugins', 'bplugins')}</p>
			</a>
		</div>
	</PanelBody>
}