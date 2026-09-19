import { isExist } from '../utils/common';
import { deskBreakpoint, mobileBreakpoint, tabBreakpoint } from '../utils/data';
import { getAdvBGCSS, getBorderBoxCSS, getBoxCSS, getMaskCSS, getMultiShadowCSS, getOverlayCSS, getTransformCSS, isValidCSS } from '../utils/getCSS';

const dimensionCSS = (dimension) => {
	const { padding, margin, height, width } = dimension || {};

	const hwCSS = (p, v) => isValidCSS(p, v);

	const heightWidthCSS = (type, obj, d) => hwCSS(type, obj?.[type]?.[d]) + hwCSS(`min-${type}`, obj?.min?.[d]) + hwCSS(`max-${type}`, obj?.max?.[d]);

	const pCSS = (p) => isValidCSS('padding', getBoxCSS(p));
	const mCSS = (m) => isValidCSS('margin', getBoxCSS(m));

	return {
		desktop: pCSS(padding?.desktop) + mCSS(margin?.desktop) + heightWidthCSS('height', height, 'desktop') + heightWidthCSS('width', width, 'desktop'),

		tablet: pCSS(padding?.tablet) + mCSS(margin?.tablet) + heightWidthCSS('height', height, 'tablet') + heightWidthCSS('width', width, 'tablet'),

		mobile: pCSS(padding?.mobile) + mCSS(margin?.mobile) + heightWidthCSS('height', height, 'mobile') + heightWidthCSS('width', width, 'mobile')
	}
}

const positionCSS = (position, selector) => {

	const { desktop = {}, tablet = {}, mobile = {} } = position;

	const css = (attr = {}) => `
		${selector}{
			${isValidCSS('position', attr?.type)}
			${isValidCSS('left', attr?.horizontal?.left)}
			${isValidCSS('right', attr?.horizontal?.right)}
			${isValidCSS('top', attr?.vertical?.top)}
			${isValidCSS('bottom', attr?.vertical?.bottom)}
		}
	`;

	return `
		
		${desktop?.type ? css(desktop) : ''}
		
		${tabBreakpoint}{
			${tablet?.type ? css(tablet) : ''}
		}

		${mobileBreakpoint}{
			${mobile?.type ? css(mobile) : ''}
		}
	`;
}

const floatingCSS = (floating, selector, id = '') => {
	const { translate = {}, rotate = {}, scale = {}, isEnabled = false } = floating || {};

	if (!isEnabled) return '';

	// Each group runs on its own duration and delay, so they cannot share a
	// property: three keyframes all animating `transform` would leave only the
	// last one applied. `translate`, `scale` and `transform` are separate
	// properties that the browser composes, so the three animate side by side.
	const groups = [
		{
			name: 'Translate',
			property: 'translate',
			values: translate,
			value: (state) => {
				if (!['x', 'y'].some(axis => isExist(translate?.[axis]?.[state]))) return '';

				return `${translate?.x?.[state] || 0}px ${translate?.y?.[state] || 0}px`;
			}
		},
		{
			name: 'Rotate',
			property: 'transform',
			values: rotate,
			value: (state) => ['x', 'y', 'z']
				.filter(axis => isExist(rotate?.[axis]?.[state]))
				.map(axis => `rotate${axis.toUpperCase()}(${rotate[axis][state]}deg)`)
				.join(' ')
		},
		{
			name: 'Scale',
			property: 'scale',
			values: scale,
			// The control exposes y and z only. `scale` is positional (x, then y, then
			// z), so x is pinned to the identity 1 -- dropping it would make y read
			// as the x axis.
			value: (state) => {
				const y = scale?.y?.[state];
				const z = scale?.z?.[state];

				if (!isExist(y) && !isExist(z)) return '';

				return isExist(z) ? `1 ${isExist(y) ? y : 1} ${z}` : `1 ${y}`;
			}
		}
	];

	const keyframes = [];
	const animations = [];

	groups.forEach(({ name, property, values, value }) => {
		const from = value('from');
		const to = value('to');

		if (!from || !to) return;

		const duration = Number(values?.duration) > 0 ? Number(values.duration) : 1000;
		const delay = Number(values?.delay) > 0 ? Number(values.delay) : 0;
		const keyframeName = `advFloat${name}${id ? `-${id}` : ''}`;

		keyframes.push(`@keyframes ${keyframeName}{ from{ ${property}: ${from}; } to{ ${property}: ${to}; } }`);
		animations.push(`${keyframeName} ${duration}ms ease-in-out ${delay}ms infinite alternate`);
	});

	if (!animations.length) return '';

	return `
		${keyframes.join(' ')}
		${selector}{
			animation: ${animations.join(', ')};
		}
	`;
}

const motionEffectsCSS = (motion, selector, id) => {
	const { isEnable = false, vertical = {}, horizontal = {}, transparency = {}, blur = {}, rotate = {}, scale = {}, effectsRelativeTo = 'viewport', effectOn = ['desktop', 'tablet-portrait', 'mobile-portrait'], isMouseEffect = false, mouseTrack = {}, tilt = {}, sticky = {} } = motion || {};

	const num = (val, fallback) => isExist(val) && !isNaN(val) ? Number(val) : fallback;

	// Keyframe names have to be unique per block, and the selector already carries
	// the block id, so it doubles as the suffix.
	// 'entire-page' walks the document scroller, 'viewport' the element's own pass
	// through the viewport -- each names its ranges differently.

	// 'viewport' is the default because it is the only one that holds a constant rate:
	// the effect runs over the element's own pass, so it reads the same on a short page
	// and a long one. 'entire-page' spreads the same travel across the whole document,
	// so the longer the page the weaker it gets -- measured at 0.15px of drift per px
	// of scroll on a 1500px page but 0.04 on a 10000px one, which is imperceptible.
	//
	// `nearest`, not `root`: the editor draws the canvas in a scrolling div (and the
	// front end scrolls the document), and `root` resolves to the document element
	// either way -- in the editor that element never scrolls, so the timeline sits at
	// 0 forever and the animation has no effect at all. `nearest` walks up to whatever
	// actually scrolls, which is the canvas in the editor and the page on the front.
	const isViewport = effectsRelativeTo === 'viewport';
	const timeline = isViewport ? 'view()' : 'scroll(nearest block)';
	// The two handles are read as a window, not as an order: a range whose start sits
	// after its end never animates -- Chrome holds the start pose and then snaps to the
	// end one -- and the control lets Top be set above Bottom, so they are sorted here.
	const range = (obj) => {
		const top = num(obj?.top, 0);
		const bottom = num(obj?.bottom, 100);
		const from = Math.min(top, bottom);
		const to = Math.max(top, bottom);

		// 'entire-page' also plays in reverse (see animation-direction below): the block
		// starts at the full effect and settles back to its resting pose as the page
		// scrolls, where 'viewport' departs from rest and builds up to the effect.
		//
		// 'entire-page' runs off the page's own scroll, so every block on the page moves
		// in step rather than each waiting its turn. The window is three screens of
		// scroll rather than a percentage of the document: as a percentage the same
		// travel got spread across however long the page happened to be, so the rate
		// collapsed from 5.6deg per 100px on a 1400px page to 0.8 on a 9900px one and the
		// effect all but vanished on anything long.
		//
		// `min()` against the percentage is what keeps a short page working: three
		// screens of scroll is more than a page like that even has, so the effect would
		// freeze part-done -- measured at 21% on a 534px scroll. Below three screens the
		// window falls back to the page itself and completes; above it, the fixed window
		// wins and the rate stops depending on page length.
		if (!isViewport) return `min(${from * 3}vh, ${from}%) min(${to * 3}vh, ${to}%)`;

		// `cover 100%` is the element fully clear of the top of the screen, which a block
		// sitting near the end of a short page never reaches -- the document runs out of
		// scroll first and the effect freezes part-way, looking broken. Measured on a
		// 2318px page the cover range topped out around 77%, so everything above that is
		// unreachable, not just 100. `contain 100%` is the furthest the block can
		// actually travel on screen, so the whole top of the slider ends there and
		// completes wherever the block sits. Below 90 the author is asking for a genuine
		// early finish and gets the cover position they named.
		return `cover ${from}% ${to >= 90 ? 'contain 100%' : `cover ${to}%`}`;
	};

	const keyframes = [];
	const animations = [];
	const timelines = [];
	const ranges = [];

	// The keyframe name has to be a valid custom-ident, and some blocks pass a
	// composite id ('someId>div'), so anything that is not a letter or digit is
	// dropped. The `advMe` prefix keeps a leading digit from starting the name.
	const suffix = String(id ?? '').replace(/[^a-zA-Z0-9]/g, '');

	const push = (name, stops, obj) => {
		keyframes.push(`@keyframes advMe${name}${suffix}{ ${stops} }`);
		animations.push(`advMe${name}${suffix}`);
		timelines.push(timeline);
		ranges.push(range(obj));
	};

	if (isEnable) {
		// Every transform effect starts from the element's own resting pose and moves
		// away from it. Running symmetrically instead (-x to +x) would leave the block
		// visibly displaced wherever it sits outside the range, since the fill is
		// `both` -- it would only look right at the midpoint of its own scroll.
		//
		// `vertical` and `horizontal` both drive `translate`, so they are emitted as
		// one keyframe -- two animations on the same property would leave only the
		// last one applied. The viewport window is the union of the two.
		const vDir = vertical?.direction;
		const hDir = horizontal?.direction;
		const vOffset = vDir ? num(vertical?.speed, 4) * 100 : 0;
		const hOffset = hDir ? num(horizontal?.speed, 4) * 100 : 0;

		if (vOffset || hOffset) {
			const vTo = vDir === 'up' ? -vOffset : vOffset;
			const hTo = hDir === 'to-left' ? -hOffset : hOffset;

			// Only an active axis gets a say in the window -- folding in the defaults of
			// an unused axis would widen it back out to the whole pass.
			const windows = [vOffset && vertical, hOffset && horizontal].filter(Boolean);

			push('Translate', `from{ translate: 0px 0px; } to{ translate: ${hTo}px ${vTo}px; }`, {
				top: Math.min(...windows.map(w => num(w?.top, 0))),
				bottom: Math.max(...windows.map(w => num(w?.bottom, 100)))
			});
		}

		const tDir = transparency?.direction;

		if (tDir) {
			// Level is the depth of the fade, so a level of 10 reaches fully transparent.
			const low = Math.max(0, 1 - num(transparency?.level, 5) / 10);

			const stops = {
				'fade-in': `from{ opacity: ${low}; } to{ opacity: 1; }`,
				'fade-out': `from{ opacity: 1; } to{ opacity: ${low}; }`,
				'fade-out-in': `0%{ opacity: 1; } 50%{ opacity: ${low}; } 100%{ opacity: 1; }`,
				'fade-in-out': `0%{ opacity: ${low}; } 50%{ opacity: 1; } 100%{ opacity: ${low}; }`
			}[tDir];

			stops && push('Opacity', stops, transparency);
		}

		const bDir = blur?.direction;

		if (bDir) {
			// 'fade-in' means coming into focus, so the blur runs down to zero. 3px per
			// step: at 1px per step the whole 0-10 range topped out at a 10px blur, which
			// barely registers next to a 400px slide or a 1.6x scale, so the control felt
			// dead through most of its travel. This puts the default of 4 at 12px and the
			// top of the scale at 30px.
			const max = num(blur?.level, 4) * 3;

			const stops = {
				'fade-in': `from{ filter: blur(${max}px); } to{ filter: blur(0px); }`,
				'fade-out': `from{ filter: blur(0px); } to{ filter: blur(${max}px); }`,
				'fade-out-in': `0%{ filter: blur(0px); } 50%{ filter: blur(${max}px); } 100%{ filter: blur(0px); }`,
				'fade-in-out': `0%{ filter: blur(${max}px); } 50%{ filter: blur(0px); } 100%{ filter: blur(${max}px); }`
			}[bDir];

			stops && push('Blur', stops, blur);
		}

		const rDir = rotate?.direction;

		if (rDir) {
			// 20deg per step: 20deg on the first notch, 80deg at the default of 4, 200deg
			// at the top. The old 36 ran the scale to a full 360deg turn, which lands the
			// block back exactly where it started and so reads as nothing happening --
			// the maximum has to stay clear of a wrap. 6 fixed that but left the low end
			// too faint to see while scrolling, which is the point of the control.
			const deg = num(rotate?.level, 4) * 20;
			const to = rDir === 'to-left' ? -deg : deg;

			push('Rotate', `from{ rotate: 0deg; } to{ rotate: ${to}deg; }`, rotate);
		}

		if (scale?.direction) {
			// Level is the depth of the change. The shrink end is clamped so a high level
			// lands on 0 rather than a negative, which would mirror the block.
			const amount = num(scale?.level, 4) * 0.15;
			const low = Math.max(0, 1 - amount);
			const high = 1 + amount;

			const stops = {
				'scale-up': `from{ scale: 1; } to{ scale: ${high}; }`,
				'scale-down': `from{ scale: 1; } to{ scale: ${low}; }`,
				'scale-down-up': `0%{ scale: 1; } 50%{ scale: ${low}; } 100%{ scale: 1; }`,
				'scale-up-down': `0%{ scale: 1; } 50%{ scale: ${high}; } 100%{ scale: 1; }`
			}[scale.direction];

			stops && push('Scale', stops, scale);
		}
	}

	// `transform` is left to the mouse effects: `translate`, `rotate` and `scale`
	// are separate properties, so the scroll animations above compose with it.
	//
	// The pose is built in JS and written straight to the element's own transform.
	// The loop below already knows the exact position each frame, so handing CSS two
	// custom properties to multiply out again only adds a substitution step -- the
	// numbers are resolved here instead. Nothing is written until the pointer moves,
	// so the element keeps whatever transform it had at rest.
	//
	// x and y arrive as the cursor's offset from the centre of the viewport, -1..1.
	const travel = 100;
	const pose = [];

	if (isMouseEffect) {
		if (mouseTrack?.direction) {
			// A flat slide in the plane of the page -- no z axis, no perspective. Only
			// tilt works in 3D. 'direct' moves with the cursor, 'opposite' mirrors it.
			const shift = mouseTrack?.direction === 'direct' ? travel : -travel;

			pose.push((x, y) => `translate(${(x * shift).toFixed(2)}px, ${(y * shift).toFixed(2)}px)`);
		}

		if (tilt?.direction) {
			// The 3D half: perspective turns the rotations into a tip towards the
			// cursor rather than a flat spin. The axes cross over, so vertical cursor
			// travel tips the element about X and horizontal travel about Y.
			const deg = 12 * (tilt?.direction === 'direct' ? 1 : -1);

			pose.push((x, y) => `perspective(1000px) rotateX(${(y * -deg).toFixed(2)}deg) rotateY(${(x * deg).toFixed(2)}deg)`);
		}
	}

	// Speed is the element's actual travel speed: 150px per second per step, so a
	// speed of 4 crosses the full 200px range in a third of a second. The movement is
	// a flat rate rather than an easing curve -- no acceleration, no slow-down tail --
	// and it is driven here rather than by a CSS transition, which would restart on
	// every pointermove and, on the shared ease-in-out curve, never arrive.
	const bindMouse = (doc, rate, build) => {
		if (!doc || !doc.defaultView) return;

		const view = doc.defaultView;
		const store = doc.bPlMouse || (doc.bPlMouse = { x: 0, y: 0, items: new Map(), frame: 0, last: 0 });

		// Re-registering on each render is what lets a changed speed take effect, and
		// keeps the entry's current position so the element does not jump.
		const item = store.items.get(selector) || { x: 0, y: 0 };

		item.rate = rate;
		item.build = build;
		store.items.set(selector, item);

		// generateCSS re-runs on every render, so the listener and the loop are bound
		// once per document and the registry above carries the rest.
		if (store.bound) return;

		store.bound = true;

		const step = (now) => {
			// Distance covered is measured against elapsed time rather than frame count,
			// so the element moves at the same speed on a 60Hz and a 144Hz display. A
			// long gap -- a backgrounded tab -- is capped so it walks back to the
			// cursor instead of teleporting.
			const delta = store.last ? Math.min(now - store.last, 100) : 16.7;

			store.last = now;

			let moving = false;

			store.items.forEach((entry, sel) => {
				// Looked up lazily and re-queried once the node goes away, so a block
				// re-rendered by the editor is picked up again.
				const el = entry.el && entry.el.isConnected ? entry.el : doc.querySelector(sel);

				if (!el) return;

				entry.el = el;

				const reach = entry.rate * delta / 1000;
				const dx = store.x - entry.x;
				const dy = store.y - entry.y;
				const gap = Math.sqrt(dx * dx + dy * dy);

				if (gap <= reach) {
					// Close enough to finish this frame, so it lands exactly on the cursor
					// and stops dead rather than creeping the last fraction of a pixel.
					entry.x = store.x;
					entry.y = store.y;
				} else {
					// Stepped along the line to the cursor rather than per axis, so a
					// diagonal run is no faster than a straight one.
					entry.x += dx / gap * reach;
					entry.y += dy / gap * reach;

					moving = true;
				}

				el.style.transform = entry.build(entry.x, entry.y);
			});

			// The loop parks itself once everything has caught up; the next pointermove
			// starts it again.
			store.frame = moving ? view.requestAnimationFrame(step) : 0;
			store.last = moving ? now : 0;
		};

		doc.addEventListener('pointermove', (e) => {
			// The target is recorded on every event, and only the write to the element
			// is held to one per frame -- throttling the read instead would render a
			// stale position and drop the last move of a gesture.
			store.x = (e.clientX / view.innerWidth - 0.5) * 2;
			store.y = (e.clientY / view.innerHeight - 0.5) * 2;

			if (!store.frame) store.frame = view.requestAnimationFrame(step);
		});
	};

	if (pose.length && typeof document !== 'undefined') {
		// Units per second, where one unit is `travel` px of element movement. Floored
		// so a speed of 0 still arrives and the loop can park itself instead of
		// spinning on a gap it never closes.
		const rate = Math.max(0.25, num(mouseTrack?.speed, num(tilt?.speed, 4)) * 1.5);
		const build = (x, y) => pose.map(fn => fn(x, y)).join(' ');

		bindMouse(document, rate, build);
		bindMouse(document.querySelector('iframe[name="editor-canvas"]')?.contentDocument, rate, build);
	}

	// Blocks saved before the control was given a device wrote their value under the
	// literal key "undefined", so that one is read as the desktop setting rather than
	// stranding them. z-index keeps the block above what scrolls past underneath it.
	const stickyOf = (device) => sticky?.[device] || (device === 'desktop' ? sticky?.undefined : '');

	// Sticky goes on the block's own wrapper, not the inner element the other effects
	// target. A sticky box can only travel inside its containing block, and the inner
	// div's parent is exactly its own height -- measured at 607px against 607px, zero
	// room, so it scrolled straight past no matter what was emitted. The wrapper sits in
	// the content flow and had 927px to move within on the same page.
	const stickySelector = selector.split('>')[0];

	// The desktop rule is unscoped so it applies at every width, which is the cascade
	// the rest of this file uses. That means a narrower device set to None has to undo
	// it explicitly -- emitting nothing just leaves the wider setting in force, so
	// turning sticky off for tablet did nothing at all.
	const inherited = (device) => device === 'tablet' ? stickyOf('desktop')
		: device === 'mobile' ? (stickyOf('tablet') || stickyOf('desktop')) : '';

	const stickyCSS = (device) => {
		const side = stickyOf(device);

		if (side) return `position: sticky; ${side}: 0; z-index: 9;`;

		return inherited(device) ? 'position: static;' : '';
	};

	// An unlisted device keeps the element static. The control can hand back an array,
	// a bare string (its single-select mode), or nothing at all, and an empty result
	// means untouched rather than "no devices" -- reading it the other way switched
	// every breakpoint off and killed all six effects everywhere.
	const devices = Array.isArray(effectOn) ? effectOn : isExist(effectOn) ? [effectOn] : [];

	const off = (name) => !devices.length || devices.includes(name) ? '' : `${selector}{ animation-name: none; }`;

	// The shared tabBreakpoint is "everything below desktop", so it covers phones too.
	// Only devices that are switched OFF emit a rule, and an enabled device emits
	// nothing to switch itself back on, so the bands have to be disjoint: selecting
	// only Mobile Portrait would otherwise be killed at 375px by the tablet rule.
	const tabOnlyBreakpoint = '@media only screen and (min-width: 641px) and (max-width: 1024px)';

	// Longhands, not the `animation` shorthand: the shorthand resets animation-timeline
	// and animation-range to their initial values, so it can only ever be written
	// before them. More importantly the duration is `auto`, which is what makes a
	// progress-based timeline map the keyframes across the whole range -- a time
	// duration is measured against the timeline's own 100% and finishes almost
	// immediately, leaving the element parked on its end pose.
	const animationCSS = animations.length ? `
		${keyframes.join(' ')}
		@supports (animation-timeline: scroll()){
			${selector}{
				animation-name: ${animations.join(', ')};
				animation-duration: ${animations.map(() => 'auto').join(', ')};
				animation-timing-function: ${animations.map(() => 'linear').join(', ')};
				animation-fill-mode: ${animations.map(() => 'both').join(', ')};
				animation-direction: ${animations.map(() => isViewport ? 'normal' : 'reverse').join(', ')};
				animation-timeline: ${timelines.join(', ')};
				animation-range: ${ranges.join(', ')};
			}
			${off('desktop') ? `${deskBreakpoint}{ ${off('desktop')} }` : ''}
			${off('tablet-portrait') ? `${tabOnlyBreakpoint}{ ${off('tablet-portrait')} }` : ''}
			${off('mobile-portrait') ? `${mobileBreakpoint}{ ${off('mobile-portrait')} }` : ''}
		}
	` : '';

	return `
		${animationCSS}
		${pose.length ? `${selector}{ transition-property: background, border, border-radius, box-shadow; }` : ''}
		${stickyCSS('desktop') ? `${stickySelector}{ ${stickyCSS('desktop')} }` : ''}
		${stickyCSS('tablet') ? `${tabBreakpoint}{ ${stickySelector}{ ${stickyCSS('tablet')} } }` : ''}
		${stickyCSS('mobile') ? `${mobileBreakpoint}{ ${stickySelector}{ ${stickyCSS('mobile')} } }` : ''}
	`;
}

const borderShadowCSS = (borderShadow) => {
	const { normal, hover } = borderShadow || {};

	const stateGenerate = (state) => {
		const { border, radius, shadow } = state || {};

		const radiusCSS = isValidCSS('border-radius', getBoxCSS(radius));
		const shadowCSS = isValidCSS('box-shadow', getMultiShadowCSS(shadow, 'box'));

		return getBorderBoxCSS(border) + radiusCSS + shadowCSS;
	}

	return {
		normal: stateGenerate(normal),
		hover: stateGenerate(hover)
	}
}

const visibilityCSS = (visibility) => {
	const { zIndex, overflow } = visibility || {};

	const overflowCSS = overflow ? `overflow: ${overflow};` : '';
	const zIndexCSS = device => `${isValidCSS('z-index', zIndex?.[device])} ${isValidCSS('position', isExist(zIndex?.[device]) ? 'relative' : '')}`

	return {
		desktop: zIndexCSS('desktop') + overflowCSS,
		tablet: zIndexCSS('tablet'),
		mobile: zIndexCSS('mobile')
	}
}

const responsiveCSS = (responsive, isBackend) => {
	const { desktop = false, tablet = false, mobile = false } = responsive || {};

	const css = isBackend ? 'opacity: 0.5;' : 'display: none;';

	const resCSS = val => val ? css : '';

	return {
		desktop: resCSS(desktop),
		tablet: resCSS(tablet),
		mobile: resCSS(mobile)
	}
}

const transitionCSS = (background, borderShadow, transform) => {
	const { transition: bgT = 0.4 } = background || {};
	const { transition: bsT = 0.4 } = borderShadow || {};
	const { transition: tfT = 200 } = transform || {};

	return `transition: background ${bgT}s, border ${bsT}s, border-radius ${bsT}s, box-shadow ${bsT}s, transform ${tfT}ms ease-in-out;`
}

// export const animationFn = (animation, id,isBackend) => {
// 	const selector = isBackend?`#${id} > div`:`$#${id}`;
// 	const element = document.querySelector(selector);
// 	if (element && animation && animation?.type) {
// 		element.setAttribute('data-aos', animation.type);
// 		element.setAttribute('data-aos-duration', animation.duration || 0.4);
// 		element.setAttribute('data-aos-delay', animation.delay || 0);
// 	}
// }
export const animationFn = (animation, id, isBackend) => {
	const selector = isBackend ? `#${id} > div` : `#${id}`;
	const element = document.querySelector(selector);
	if (element && animation && animation.type) {

		element.setAttribute('data-aos', animation.type);
		element.setAttribute('data-aos-duration', animation.duration * 1000 || 0.4);
		element.setAttribute('data-aos-delay', animation.delay * 1000 || 0);

		if (!element.classList.contains('aos-init')) {
			element.classList.add('aos-init');
			window?.AOS?.init();
		}

		if (isBackend) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.intersectionRatio > 0.5) {
						element.classList.add('aos-animate');
					} else { element.classList.remove('aos-animate'); }
				});
			}, { threshold: [0.5] });

			observer.observe(element);
		}

	}
};

export const generateCSS = (id, advanced, isBackend = false, isFirstChild = true) => {
	const { dimension, transform, background, borderShadow, mask, animation, visibility, responsive, position = {}, floating = {}, motion = {}, css = '' } = advanced || {};

	const selector = isBackend ? `#${id}>div>div${isFirstChild ? ':first-child' : ''}` : `#${id}>div`;

	// !isBackend && animationFn(animation, id);
	animationFn(animation, id, isBackend);

	const dCSS = dimensionCSS(dimension).desktop + visibilityCSS(visibility).desktop + transitionCSS(background, borderShadow, transform) + getMaskCSS(mask);
	const tCSS = dimensionCSS(dimension).tablet + visibilityCSS(visibility).tablet + responsiveCSS(responsive, isBackend).tablet;
	const mCSS = dimensionCSS(dimension).mobile + visibilityCSS(visibility).mobile + responsiveCSS(responsive, isBackend).mobile;

	const nCSS = borderShadowCSS(borderShadow).normal;
	const hCSS = borderShadowCSS(borderShadow).hover;

	const resCSS = responsiveCSS(responsive, isBackend).desktop;

	return `
		${(dCSS || nCSS) ? `${selector} {
			${dCSS}
			${nCSS}
		}` : ''}
		${(hCSS) ? `${selector}:hover {
			${hCSS}
		}` : ''}

		${resCSS ? `${deskBreakpoint} {
			${selector}{
				${resCSS}
			}
		}` : ''}

		${tCSS ? `${tabBreakpoint} {
			${selector}{
				${tCSS}
			}
		}` : ''}

		${mCSS ? `${mobileBreakpoint} {
			${selector}{
				${mCSS}
			}
		}` : ''}

		${getAdvBGCSS(background?.normal, selector)}
		${getAdvBGCSS(background?.hover, selector, true)}
		${getOverlayCSS(background?.overlay, selector)}
		${getOverlayCSS(background?.hoverOverlay, selector, true)}
		${isExist(transform?.normal) ? getTransformCSS(transform?.normal, selector) : ''}
		${isExist(transform?.hover) ? getTransformCSS(transform?.hover, selector, true) : ''}
		${positionCSS(position, selector)}
		${floatingCSS(floating, selector, id)}
		${motionEffectsCSS(motion, selector, id)}
		${css}
	`.replace(/\s+/g, ' ');
}
export default generateCSS;