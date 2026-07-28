import { useEffect } from 'react';

/**
 * Shared dismiss behaviour for the wizard's overlays.
 *
 * Escape closes, body scroll is locked while open, and focus moves to
 * `focusRef` so Escape is reachable from the keyboard straight away.
 *
 * The keydown listener is registered in the capture phase so nothing in
 * between can swallow the key first. Note that once focus moves into a
 * cross-origin iframe, key events belong to that document and Escape can no
 * longer be observed here — always keep a visible close control too.
 *
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {object} [focusRef] - Ref to focus when the overlay opens
 */
const useModalDismiss = (isOpen, onClose, focusRef) => {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const onKeyDown = (e) => {
			if ('Escape' === e.key) {
				onClose();
			}
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKeyDown, true);
		focusRef?.current?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', onKeyDown, true);
		};
		// onClose is recreated every render but only closes over refs and
		// setState, so re-subscribing on each one would be pure churn.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);
};
export default useModalDismiss;
