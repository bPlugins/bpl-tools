import { useState, useEffect } from 'react';

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Color picker — native swatch plus a hex text input, kept in sync.
 *
 * The text input holds its own draft so a half-typed "#0f" isn't rejected
 * mid-keystroke; only complete hex values are committed upwards.
 *
 * @param {object}   props
 * @param {string}   props.id        - Field id; becomes the saved option key
 * @param {string}   props.value     - Current hex value
 * @param {string}   [props.default] - Fallback when `value` is empty
 * @param {Function} props.onChange  - Called with the new hex string
 */
const ColorField = ({ id, value, default: fallback = '#000000', onChange }) => {
	const current = value || fallback;
	const [draft, setDraft] = useState(current);

	// Follow the swatch (and any external reset) without clobbering typing.
	useEffect(() => {
		setDraft(current);
	}, [current]);

	return <div className='bPlOnboardingColor'>
		<input
			type='color'
			id={id}
			className='colorSwatch'
			value={current}
			onChange={e => onChange(e.target.value)}
		/>

		<input
			type='text'
			className='colorHex'
			value={draft}
			spellCheck='false'
			aria-label={`${id} hex value`}
			onChange={e => {
				const next = e.target.value;
				setDraft(next);
				if (HEX.test(next.trim())) {
					onChange(next.trim());
				}
			}}
			onBlur={() => setDraft(current)}
		/>
	</div>;
};
export default ColorField;
