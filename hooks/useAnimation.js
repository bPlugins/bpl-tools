import { useEffect } from 'react';

const useAnimation = (element, animation) => {
	const { type, duration, delay } = animation || {};

	useEffect(() => {
		window['AOS']?.init();
	}, []);

	useEffect(() => {
		if (element && type) {
			element.setAttribute('data-aos', type);
			element.setAttribute('data-aos-duration', duration || 0.4);
			element.setAttribute('data-aos-delay', delay || 0);

			element.classList.remove('aos-init');
			element.classList.remove('aos-animate');

			setTimeout(() => {
				element.classList.add('aos-init');
				element.classList.add('aos-animate');
			}, 500);
		}
	}, [element, type, duration, delay]);
}
export default useAnimation;