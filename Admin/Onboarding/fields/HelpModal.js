import { useState, useRef } from 'react';
import { __ } from '@wordpress/i18n';

import useModalDismiss from '../useModalDismiss';
import { infoIcon, closeIcon } from '../../utils/icons';

/**
 * "What is this?" affordance for a setting whose name isn't self-explanatory.
 *
 * A one-line `description` belongs on the field itself; this is for the cases
 * that need a paragraph, an example, or a "turn this on when…" — detail that
 * would bury the actual choice if it sat inline.
 *
 * @param {object}   props
 * @param {object}   props.help  - {title?, body, example?} — `body` may be an array of paragraphs
 * @param {string}   props.label - Field label, used in the trigger's aria-label
 */
const HelpModal = ({ help, label = '' }) => {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef(null);
	const closeRef = useRef(null);

	const close = () => {
		setIsOpen(false);
		triggerRef.current?.focus();
	};

	useModalDismiss(isOpen, close, closeRef);

	if (!help?.body) {
		return null;
	}

	const paragraphs = Array.isArray(help.body) ? help.body : [help.body];

	return <>
		<button
			type='button'
			ref={triggerRef}
			className='fieldHelpTrigger'
			onClick={() => setIsOpen(true)}
			aria-label={label ? `${__('What is')} “${label}”?` : __('More information')}
		>
			{infoIcon}
		</button>

		{isOpen && <div className='bPlOnbHelpModal' role='dialog' aria-modal='true' aria-label={help.title || label}>
			<div className='helpContent'>
				<header className='helpHeader'>
					<h3>{help.title || label}</h3>
					<button type='button' ref={closeRef} className='helpClose' onClick={close} aria-label={__('Close')}>
						{closeIcon}
					</button>
				</header>

				<div className='helpBody'>
					{paragraphs.map((text, i) => <p key={i} dangerouslySetInnerHTML={{ __html: text }} />)}

					{help.example && <pre className='helpExample'>{help.example}</pre>}
				</div>
			</div>

			<div className='helpOverlay' onClick={close} />
		</div>}
	</>;
};
export default HelpModal;
