import { useState, useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';

import './style.scss';

import Progress from './Progress';
import Step from './Step';
import useWPAjax from '../../hooks/useWPAjax';
import { closeIcon } from '../utils/icons';

/**
 * Full-screen guided setup wizard, shown once after plugin activation.
 *
 * Config-driven: this component owns layout, navigation, progress, and
 * persistence; the host plugin supplies step definitions and an AJAX handler.
 *
 * Values are saved on every forward move rather than at the end, so a user who
 * abandons the wizard halfway keeps whatever they already chose.
 *
 * @param {object}   props
 * @param {string}   props.name             - Plugin name, shown in the top bar
 * @param {object}   props.media            - {logo, thumbnail?, video?, isYoutube?} — video/thumbnail act as the step-video fallback
 * @param {object[]} props.steps            - Step definitions; see readme.md
 * @param {object}   [props.values]         - Current option values keyed by field id
 * @param {string}   props.ajaxAction       - WP Ajax action name. This alone is enough for a plain wp_ajax_ handler
 * @param {string}   [props.ajaxModel]      - Only for plugins whose handler dispatches by model; posted as `model`
 * @param {string}   [props.ajaxMethod]     - Only for plugins whose handler dispatches by method; posted as `method`
 * @param {string}   props.nonce            - Nonce matching whatever the handler verifies
 * @param {string}   props.exitUrl          - Target for "Exit Guided Setup" and "Go to Dashboard"
 * @param {object}   props.finishButton     - {label, url} — primary CTA on the final step
 * @param {Function} [props.onComplete]     - Called with the final values before navigating away
 */
const Onboarding = (props) => {
	const {
		name, media, steps = [], values: initialValues = {},
		ajaxAction = '', ajaxModel = '', ajaxMethod = '', nonce = '',
		exitUrl = '', finishButton, onComplete
	} = props;

	const [current, setCurrent] = useState(0);
	const [values, setValues] = useState(initialValues);
	// Set once the user commits to leaving, and deliberately never cleared on
	// success: the request finishes well before the browser paints the next
	// page, so reverting the button here would flash it back to its idle label
	// for the duration of the navigation.
	const [isLeaving, setIsLeaving] = useState(false);
	const pendingUrl = useRef('');

	const params = { nonce };
	if (ajaxModel) {
		params.model = ajaxModel;
	}
	if (ajaxMethod) {
		params.method = ajaxMethod;
	}

	// `|| {}` because useWPAjax bails out early when wp-util is missing.
	// `isLoading` is intentionally not read — see the isSaving prop below.
	const { data, saveData, error } = useWPAjax(ajaxAction, params, false) || {};

	// Navigating away cancels an in-flight request, so the final save has to
	// land before we leave. Intermediate saves are fire-and-forget.
	useEffect(() => {
		if (data && pendingUrl.current) {
			const url = pendingUrl.current;
			pendingUrl.current = '';
			onComplete?.(values);
			window.location.href = url;
		}
	}, [data]);

	// A failed final save must not strand the user on a dead button.
	useEffect(() => {
		if (error) {
			pendingUrl.current = '';
			setIsLeaving(false);
		}
	}, [error]);

	if (!steps.length) {
		return null;
	}

	const step = steps[Math.min(current, steps.length - 1)];
	const isFirst = 0 === current;
	const isLast = current === steps.length - 1;

	const handleChange = (id, value) => setValues(prev => ({ ...prev, [id]: value }));

	const persist = (extra = {}) => saveData?.({ ...values, ...extra, step: step.key || '' });

	const handleNext = () => {
		// Informational steps have nothing to persist — skip the round-trip.
		if (step.fields?.length) {
			persist();
		}
		setCurrent(i => Math.min(i + 1, steps.length - 1));
	};

	const handleBack = () => setCurrent(i => Math.max(i - 1, 0));

	// Advance without persisting — for steps the user chooses not to engage
	// with. Any edits made before changing their mind are rolled back to the
	// values we started with: the final save posts the whole set, so leaving
	// them in state would write exactly what "Skip" implies it won't.
	const handleSkip = () => {
		const ids = (step.fields || []).map(field => field.id);

		if (ids.length) {
			setValues(prev => {
				const next = { ...prev };
				ids.forEach(id => { next[id] = initialValues[id]; });
				return next;
			});
		}

		setCurrent(i => Math.min(i + 1, steps.length - 1));
	};

	const leave = (url) => {
		if (!url || isLeaving) {
			return;
		}
		setIsLeaving(true);
		pendingUrl.current = url;
		persist({ completed: true });
	};

	return <div className='bPlOnboarding'>
		<header className='bPlOnboardingBar'>
			<div className='barBrand'>
				{media?.logo && <img src={media.logo} alt={name || 'bPlugins'} />}
				{name && <span className='barName'>{name}</span>}
			</div>

			<Progress total={steps.length} current={current} onGoTo={setCurrent} />

			<button type='button' className='barExit' disabled={isLeaving} onClick={() => leave(exitUrl)}>
				{__('Exit Guided Setup')}
				{closeIcon}
			</button>
		</header>

		<main className='bPlOnboardingBody'>
			<Step
				step={step}
				media={media}
				name={name}
				values={values}
				isFirst={isFirst}
				isLast={isLast}
				// Only the blocking case. Intermediate saves are fire-and-forget,
				// so surfacing `isLoading` there just flickered the next step's
				// button while the previous step's request was still in flight.
				isSaving={isLeaving}
				error={error ? __('Could not save your settings. Please try again.') : ''}
				finishButton={finishButton}
				exitUrl={exitUrl}
				onChange={handleChange}
				onNext={handleNext}
				onBack={handleBack}
				onSkip={handleSkip}
				onFinish={leave}
			/>
		</main>
	</div>;
};

export { Progress, Step };
export default Onboarding;
