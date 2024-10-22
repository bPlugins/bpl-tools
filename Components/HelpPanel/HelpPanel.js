import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { bookIcon, headsetIcon, starIcon, rightArrowIcon } from '../../utils/icons';
import './HelpPanel.scss';

const HelpPanel = ({ slug, docsLink }) => {
	return <PanelBody className='bPlPanelBody bPlHelpPanel' title={__('Help')} initialOpen={false}>

		<div className='helpItems'>
			{docsLink && <a href={docsLink} target='_blank' rel='noreferrer'>
				{bookIcon}
				<p>{__('Read Documentation')}</p>
			</a>}

			<a href='https://bplugins.com/support' target='_blank' rel='noreferrer'>
				{headsetIcon}
				<p>{__('Contact Support')}</p>
			</a>

			{slug && <a href={`https://wordpress.org/support/plugin/${slug}/reviews/#new-post`} target='_blank' rel='noreferrer'>
				{starIcon}
				<p>{__('Rate Plugin')}</p>
			</a>}

			<a href='https://bplugins.com/products' target='_blank' rel='noreferrer'>
				{rightArrowIcon}
				<p>{__('Other Plugins')}</p>
			</a>
		</div>
	</PanelBody>
}
export default HelpPanel;