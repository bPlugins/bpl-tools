import { useEffect } from 'react';

const useIframeAssetSync = (prefixes = []) => {
	useEffect(() => {
		if (!prefixes?.length) return;

		const iframe = document.querySelector('iframe[name="editor-canvas"]');
		const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
		if (!iframeDoc) return;

		prefixes.forEach((prefix) => {
			const selectors = `link[id*="${prefix}"], style[id*="${prefix}"], script[id*="${prefix}"]`;
			const parentElements = document.querySelectorAll(selectors);

			parentElements.forEach((el) => {
				const { id: elementId } = el;
				if (!elementId || iframeDoc.getElementById(elementId)) return;

				const clonedElement = el.cloneNode(true);
				const isInHead = el.closest('head') !== null;

				if (isInHead) {
					iframeDoc.head.appendChild(clonedElement);
				} else {
					iframeDoc.body.appendChild(clonedElement);
				}
			});
		});
	}, [prefixes]);
};
export default useIframeAssetSync;