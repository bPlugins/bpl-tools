import { checkIcon } from '../utils/icons';

/**
 * Step progress rail — numbered dots joined by connectors.
 *
 * Completed steps are clickable so a user can go back and change an answer.
 * Steps ahead of the current one are inert; the wizard is linear forwards.
 *
 * @param {object}   props
 * @param {number}   props.total    - Total step count
 * @param {number}   props.current  - Zero-based index of the active step
 * @param {Function} props.onGoTo   - Called with a zero-based index when a completed dot is clicked
 */
const Progress = ({ total = 0, current = 0, onGoTo }) => {
	if (total < 2) {
		return null;
	}

	return <ol className='bPlOnboardingProgress' aria-label='Setup progress'>
		{Array.from({ length: total }, (_, i) => {
			const isDone = i < current;
			const isActive = i === current;
			const state = isDone ? 'done' : (isActive ? 'active' : 'upcoming');

			return <li key={i} className={`progressItem ${state}`}>
				<button
					type='button'
					className='progressDot'
					disabled={!isDone}
					aria-current={isActive ? 'step' : undefined}
					aria-label={`Step ${i + 1} of ${total}`}
					onClick={() => isDone && onGoTo?.(i)}
				>
					{isDone ? checkIcon : i + 1}
				</button>

				{i < total - 1 && <span className='progressLine' aria-hidden='true' />}
			</li>;
		})}
	</ol>;
};
export default Progress;
