import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, show }) => {
	const [container, setContainer] = useState(null);

	useEffect(() => {
		if (!show) {
			// Clean up when modal closes
			const el = document.getElementById('bPl-template-library-portal');
			if (el && document.body.contains(el)) {
				document.body.removeChild(el);
			}
			setContainer(null);
			return;
		}

		// Create container only once when show is true
		let el = document.getElementById('bPl-template-library-portal');
		if (!el) {
			el = document.createElement('div');
			el.id = 'bPl-template-library-portal';
			document.body.appendChild(el);
		}
		setContainer(el);

		// Cleanup function
		return () => {
			// Don't remove on unmount if still showing
			if (!show) return;
		};
	}, [show]);

	if (!container) {
		return null;
	}

	return createPortal(children, container);
};

export default Portal;
