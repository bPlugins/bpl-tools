import { __ } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';

import './AboutProModal.scss';

const AboutProModal = ({ isProModalOpen, setIsProModalOpen, link, children }) => isProModalOpen && <Modal className='bplAboutProModal' title={__('Upgrade to PRO')} onRequestClose={() => setIsProModalOpen(false)}>
	<h3>{__('Explore new features in Pro')}</h3>

	<ul className='features'>
		{children}
	</ul>

	<h4 className='text'>{__('To unlock those features! Upgrade to Pro')}</h4>

	<a className='upgradeNow' href={link} target='_blank' rel='noreferrer'>{__('Upgrade Now', 'advanced-post-block')}</a>
</Modal>;
export default AboutProModal;