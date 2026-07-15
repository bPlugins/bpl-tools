/**
	* AboutProModal Component
	*
	* @props isProModalOpen (required): Controls modal visibility (Boolean)
	* @props setIsProModalOpen (required): Modal open state setter (Function)
	* @props link (required): Upgrade link URL (String)
	* @props children (optional): Feature list items rendered inside the modal (Node)
	*/

import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './AboutProModal.scss';
import Button from '../../Components/Button/Button';

const AboutProModal = ({ isProModalOpen, setIsProModalOpen, link, children }) => isProModalOpen && <Modal className='bplAboutProModal' title={__('Upgrade to PRO')} onRequestClose={() => setIsProModalOpen(false)}>
	<h3>{__('Explore new features in Pro')}</h3>

	<ul className='features'>
		{children}
	</ul>

	<h4 className='text'>{__('To unlock those features! Upgrade to Pro')}</h4>

	<br />
	<Button href={link} target='_blank'>{__('Upgrade Now')}</Button>
</Modal>;
export default AboutProModal;