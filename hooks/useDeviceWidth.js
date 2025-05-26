import { useEffect, useState } from 'react';
const useDeviceWidth = () => {
	const [device, setDevice] = useState('desktop');

	const handleWindowSizeChange = () => {
		const width = window.innerWidth;
		if (width > 1024) {
			setDevice('desktop');
		} else if (width > 640) {
			setDevice('tablet');
		} else {
			setDevice('mobile');
		}
	};

	useEffect(() => {
		handleWindowSizeChange();
		window.addEventListener('resize', handleWindowSizeChange);

		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		};
	}, []);

	return { device };
};

export default useDeviceWidth;