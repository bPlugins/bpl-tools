import { __ } from '@wordpress/i18n';

import Video, { resolveVideo } from './Video';
import Field from './fields';
import { checkIcon, lockIcon, chevronLeftIcon, chevronRightIcon, externalIcon } from '../utils/icons';

/**
 * One wizard screen: heading, optional video, bullets, fields, tips, footer.
 *
 * @param {object}   props
 * @param {object}   props.step        - Step definition
 * @param {object}   props.media       - Plugin media, used as the video fallback
 * @param {string}   props.name        - Plugin name
 * @param {object}   props.values      - All wizard values
 * @param {boolean}  props.isFirst     - Hides the Back button
 * @param {boolean}  props.isLast      - Swaps Next for the finish CTA
 * @param {boolean}  props.isSaving    - Leaving the wizard: disables the footer and spins the primary action. Stays true until the browser navigates.
 * @param {string}   [props.error]     - Save failure message
 * @param {object}   [props.finishButton] - {label, url} for the final step
 * @param {string}   [props.exitUrl]   - "Go to Dashboard" target on the final step
 * @param {Function} props.onChange    - (id, value)
 * @param {Function} props.onNext
 * @param {Function} props.onBack
 * @param {Function} props.onSkip   - Advance without persisting this step's fields
 * @param {Function} props.onFinish
 */
const Step = (props) => {
	const {
		step, media, name, values, isFirst, isLast, isSaving, error,
		finishButton, exitUrl, onChange, onNext, onBack, onSkip, onFinish
	} = props;

	// Step content is built once, before the user has answered anything, so
	// copy that needs to react to an earlier step's answer is declared as a
	// function and resolved here against the live values.
	const resolve = (value) => ('function' === typeof value ? value(values) : value);

	const video = resolveVideo(step.video, media);
	const title = resolve(step.title);
	const subtitle = resolve(step.subtitle);
	const bullets = resolve(step.bullets) || [];
	const features = resolve(step.features) || [];
	const fields = step.fields || [];
	const tips = resolve(step.tips) || [];
	const tipsLabel = resolve(step.tipsLabel);
	const secondaryAction = step.secondaryAction;

	return <div className='bPlOnboardingStep'>
		<div className='stepCard'>
			{title && <h2 className='stepTitle'>{title}</h2>}
			{subtitle && <p className='stepSubtitle'>{subtitle}</p>}

			{video && <Video video={video} name={name} />}

			{bullets.length > 0 && <ul className='stepList'>
				{bullets.map((item, i) => <li key={i}>
					<span className='listIcon' aria-hidden='true'>{checkIcon}</span>
					<span dangerouslySetInnerHTML={{ __html: item }} />
				</li>)}
			</ul>}

			{features.length > 0 && <ul className='stepFeatures'>
				{features.map((feature, i) => <li key={i} className={`featureRow ${feature.locked ? 'locked' : ''}`}>
					<span className='featureIcon' aria-hidden='true'>
						{feature.locked ? lockIcon : checkIcon}
					</span>

					<div className='featureBody'>
						<h4 className='featureTitle'>
							<span dangerouslySetInnerHTML={{ __html: feature.title }} />
							{feature.badge && <span className={`featureBadge ${feature.locked ? 'isPro' : 'isIncluded'}`}>
								{feature.badge}
							</span>}
						</h4>

						{feature.description && <p
							className='featureDescription'
							dangerouslySetInnerHTML={{ __html: feature.description }}
						/>}
					</div>
				</li>)}
			</ul>}

			{fields.length > 0 && <div className='stepFields'>
				{fields.map(field => <Field
					key={field.id}
					field={field}
					values={values}
					onChange={onChange}
				/>)}
			</div>}

			{tips.length > 0 && <div className='stepTips'>
				{tipsLabel && <h3 className='tipsLabel'>{tipsLabel}</h3>}

				<ul className='stepList'>
					{tips.map((tip, i) => <li key={i}>
						<span className='listIcon' aria-hidden='true'>{checkIcon}</span>
						<span dangerouslySetInnerHTML={{ __html: tip }} />
					</li>)}
				</ul>
			</div>}

			{error && <div className='stepError' role='alert'>{error}</div>}

			<div className='stepFooter'>
				<div className='footerStart'>
					{!isFirst && <button type='button' className='onbButton ghost' onClick={onBack}>
						{chevronLeftIcon}
						{__('Back')}
					</button>}
				</div>

				<div className='footerEnd'>
					{step.skipLabel && !isLast && <button
						type='button'
						className='onbButton link'
						disabled={isSaving}
						onClick={onSkip}
					>
						{step.skipLabel}
					</button>}

					{secondaryAction?.url && <a
						className='onbButton link external'
						href={secondaryAction.url}
						target='_blank'
						rel='noopener noreferrer'
					>
						{secondaryAction.label}
						{externalIcon}
					</a>}

					{isLast && exitUrl && <button
						type='button'
						className='onbButton link'
						disabled={isSaving}
						onClick={() => onFinish(exitUrl)}
					>
						{__('Go to Dashboard')}
					</button>}

					{/* The label never changes — swapping it out and back is what
					    read as a flicker while the page was still navigating.
					    Only the trailing icon becomes a spinner. */}
					<button
						type='button'
						className='onbButton primary'
						disabled={isSaving}
						onClick={() => isLast ? onFinish(finishButton?.url) : onNext()}
					>
						{isLast ? (finishButton?.label || __('Finish')) : (step.nextLabel || __('Continue'))}
						{isSaving
							? <span className='onbSpinner' aria-hidden='true' />
							: chevronRightIcon}
					</button>
				</div>
			</div>
		</div>
	</div>;
};
export default Step;
