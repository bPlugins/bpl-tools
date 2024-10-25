import generateCSS from './generateCSS';

document.addEventListener('DOMContentLoaded', () => {
	const advancedEls = document.querySelectorAll('[data-bblocks-advanced]');
	const style = document.createElement('style');
	let css = '';

	const regenerateCSS = (element) => {
		const dataAdvanced = element.getAttribute('data-bblocks-advanced');

		if (dataAdvanced) {
			try {
				const advanced = JSON.parse(dataAdvanced);
				const { animation } = advanced;

				if (animation && animation?.type) {
					setTimeout(() => {
						window['AOS'].init();
					}, []);
				}

				const newCSS = generateCSS(element.id, advanced);
				css += newCSS;
				element.removeAttribute('data-bblocks-advanced');
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Invalid JSON in data-bblocks-advanced attribute:', error);
			}
		}
	};

	advancedEls.length && advancedEls.forEach(advancedEl => {
		regenerateCSS(advancedEl);
	});

	if (css) {
		style.innerHTML = css;
		document.head.appendChild(style);
	}
});