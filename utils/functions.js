import { produce } from 'immer';

export const getBoxValue = object => Object.values(object).join(' ');

export const getImageSizes = (image, imageSizes) => {
	if (!image) return [];
	let options = [];
	const sizes = image.media_details.sizes;

	for (const key in sizes) {
		const imageSize = imageSizes.find(s => s.slug === key);
		if (imageSize) {
			options.push({ label: imageSize.name, value: sizes[key].source_url });
		}
	}
	return options;
}

export const tabController = () => {
	setTimeout(() => {
		const panelBodies = document.querySelectorAll('.bPlPanelBody:not(.itemPanelBody) > h2 > button');
		panelBodies.forEach(item => {
			item.addEventListener('click', clickEveryItem);
		});

		function clickEveryItem() {

			this.removeEventListener('click', clickEveryItem);
			panelBodies.forEach(item => {
				if (item.getAttribute('aria-expanded') === 'true' && !item.isEqualNode(this)) {
					item.click();
				}
			});
			setTimeout(() => {
				this.addEventListener('click', clickEveryItem);
			}, 500);
		}
	}, 500);
};

export const updateData = (attr, value, ...props) => {
	if (props.length === 0) {
		return value;
	}
	const [currentProp, ...remainingProps] = props;
	if (remainingProps.length === 0) {
		return produce(attr, draft => {
			if (draft === null || draft === undefined) {
				draft = {};
			}
			draft[currentProp] = value;
		});
	}
	return produce(attr, draft => {
		if (draft === null || draft === undefined) {
			draft = {};
		}
		if (!Object.prototype.hasOwnProperty.call(draft, currentProp)) {
			draft[currentProp] = {};
		}
		draft[currentProp] = updateData(draft[currentProp], value, ...remainingProps);
	});
}

export const debounce = (fn, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};

export const isExist = (value) => {
	if (value === undefined || value === null || value === '') {
		return false;
	}
	if (Array.isArray(value) && value.length === 0) {
		return false;
	}
	if (typeof value === 'object' && Object.keys(value).length === 0) {
		return false;
	}
	if (typeof value === 'string' && value.trim() === '') {
		return false;
	}
	if (typeof value === 'number' && value === 0) {
		return false;
	}
	return true;
};