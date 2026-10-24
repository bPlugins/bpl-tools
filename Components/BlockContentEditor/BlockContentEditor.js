/**
	* BlockContentEditor Component
	*
	* A nested block editor for block markup that is stored as a string attribute (popups, slides, tabs...).
	* The host editor's settings are inherited, so media upload, colors and font sizes keep working, and the canvas
	* is an editor iframe that loads the host's block, theme and global styles, so blocks look like they do on the main canvas.
	*
	* @props value (required): Serialized block markup (String)
	* @props onChange (required): Receives the serialized markup on every change (Function)
	* @props className (optional): '' (String)
	* @props area (optional): { width, height, background } (Object)
	*   Renders the blocks inside a slide-sized area so they wrap like they will on the front end.
	*   width/height: px numbers measured from the host editor; a missing one falls back to 100% / auto.
	*   background: the Background component's value object, applied through getBackgroundCSS.
	*   padding: { top, right, bottom, left } as edited by BoxControl, applied through getBoxCSS.
	*   border: a BorderBoxControl value (flat or per side), applied through getBorderBoxCSS.
	*   radius: { top, right, bottom, left } corner radii (CSS shorthand order) as edited by BoxControl.
	* @props settings (optional): {} (Object)
	*   Extra block editor settings for the nested editor, merged over the host's (template and templateLock are always dropped).
	*   Blocks in the nested editor read them through select('core/block-editor').getSettings(), so a plugin can scope features to this editor.
	*   settings.styles: [{ css }] entries appended to the canvas iframe's styles (e.g. keyframes the blocks need); not merged into the settings themselves.
	*   Pass a memoized object: a new identity re-applies the settings and the canvas styles.
	*
	* BlockContentModal: the same editor inside a Modal.
	* @props isOpen (required): (Boolean)
	* @props onClose (required): (Function)
	* @props title (optional): 'Edit Content' (String)
	* @props value, onChange, className, area, settings: Same as BlockContentEditor
	*/

import { useState, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { BlockEditorProvider, BlockList, BlockCanvas, BlockInspector, BlockEditorKeyboardShortcuts } from '@wordpress/block-editor';
import { createBlock, getDefaultBlockName, isUnmodifiedDefaultBlock, parse, serialize } from '@wordpress/blocks';
import { Modal, Popover, SlotFillProvider } from '@wordpress/components';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';

import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, isValidCSS } from '../../utils/getCSS';

import './BlockContentEditor.scss';

// A nested editor has no root appender, so keep an empty default block at the end as the typing target
const withTrailingBlock = blocks => {
	const lastBlock = blocks[blocks.length - 1];

	return lastBlock && isUnmodifiedDefaultBlock(lastBlock) ? blocks : [...blocks, createBlock(getDefaultBlockName() || 'core/paragraph')];
};

// That trailing block is editor-only; drop it before saving
const withoutTrailingBlock = blocks => {
	const lastBlock = blocks[blocks.length - 1];

	return lastBlock && isUnmodifiedDefaultBlock(lastBlock) ? blocks.slice(0, -1) : blocks;
};

const noSettings = {};

const BlockContentEditor = ({ value = '', onChange, className = '', area, settings: extraSettings = noSettings }) => {
	// Parsed once on mount; the modal unmounts the editor on close, so each open starts from the saved value
	const [blocks, setBlocks] = useState(() => withTrailingBlock(parse(value)));

	// Read before the nested provider mounts, so it resolves to the host editor's store.
	// The template lock is dropped: a CPT with template_lock 'all' would otherwise lock the nested inserter too.
	// __unstableResolvedAssets comes along too: that is what the canvas iframe loads into its <head> (block, theme and global stylesheets).
	// The caller's extra settings go on top; their `styles` are canvas styles (below), so they never replace the host's theme styles
	const hostSettings = useSelect(select => select('core/block-editor').getSettings(), []);
	const { styles: extraStyles, ...restSettings } = extraSettings || noSettings;
	const settings = useMemo(() => ({ ...hostSettings, ...restSettings, template: undefined, templateLock: false }), [hostSettings, extraSettings]);

	// Each instance scopes its own area background rule, so two open editors never style each other's area
	const areaId = `bPlBlockContentArea-${useInstanceId(BlockContentEditor)}`;

	// The helpers return declarations text ('' when there is nothing to apply), so they belong in a scoped rule, not style={}
	const areaCSS = area ? [getBackgroundCSS(area.background) || '', isValidCSS('padding', getBoxCSS(area.padding)), getBorderBoxCSS(area.border), isValidCSS('border-radius', getBoxCSS(area.radius))].join(' ').trim() : '';

	// A fixed height (not min-height) keeps the boundary honest; content that doesn't fit overflows visibly and stays editable
	const areaStyle = {
		width: area?.width ? `${area.width}px` : '100%',
		height: area?.height ? `${area.height}px` : 'auto'
	};

	// The canvas is an iframe, so the top-document scss never reaches the blocks: everything they need in there is an editor style.
	// The host's settings.styles are the theme and global styles the main canvas gets; our own rules are appended as one more entry.
	// EditorStyles leaves the css untouched inside an iframe (it only prefixes selectors for a non-iframed canvas), so plain selectors apply;
	// body.editor-styles-wrapper outranks a theme's `:root :where(body)` padding, so the 60px top keeps room for the first block's toolbar.
	// Memoized because EditorStyles is memo()'d on the array identity: a new array each render would re-apply every stylesheet.
	const styles = useMemo(() => [...(settings.styles || []), ...(Array.isArray(extraStyles) ? extraStyles : []), {
		css: `
			body.editor-styles-wrapper { padding: 60px 35px 35px; }
			.bPlBlockContentArea { box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start; margin: 0 auto; outline: 1px dashed #c3c4c7; outline-offset: 2px; overflow: visible; }
			.bPlBlockContentArea > * { max-width: 100%; }
			${areaCSS ? `#${areaId} { ${areaCSS} }` : ''}
		`
	}], [settings.styles, extraStyles, areaId, areaCSS]);

	const handleChange = newBlocks => {
		setBlocks(withTrailingBlock(newBlocks));
		onChange(serialize(withoutTrailingBlock(newBlocks)));
	};

	// On its own, BlockList's root is a flow (`default`) layout with no layout class: `is-layout-constrained`, `has-global-padding` and the
	// content-width limit of the post canvas are added by the editor package's VisualEditor through className/layout props, not by BlockList.
	// That bare root is the plain full-width container the real slide is (a flex column with no constrained width), so no `layout` is passed,
	// and useRootPaddingAwareAlignments stays as the host has it: it only kicks in for constrained layouts (nested Group blocks), like on the front end.
	// `is-layout-flow` gives the root the same block-gap spacing rules the rendered slide gets on the frontend and in the host canvas, so content height matches the measured area
	const blockList = <BlockList className='is-layout-flow' />;

	return <BlockEditorProvider value={blocks} settings={settings} onInput={handleChange} onChange={handleChange}>
		<SlotFillProvider>
			<ShortcutProvider className={`bPlBlockContentEditor ${className}`}>
				<BlockEditorKeyboardShortcuts />

				<div className='bPlBlockContentCanvas'>
					{/* BlockCanvas is BlockTools plus the editor iframe (writing flow, typing observer and EditorStyles included), filling the canvas box */}
					{/* The public export only forwards children/height/styles and always names the iframe 'editor-canvas', so tests scope it through the modal */}
					<BlockCanvas height='100%' styles={styles}>
						{/* With an area, blocks wrap at the slide's width so the author feels the real slide */}
						{area ? <div id={areaId} className='bPlBlockContentArea' style={areaStyle}>
							{blockList}
						</div> : blockList}
					</BlockCanvas>

					{/* Toolbars and popovers of an iframed canvas render in the parent document; this slot keeps them inside the modal instead of the host editor's slot */}
					<div className='bPlBlockContentPopovers'>
						<Popover.Slot />
					</div>
				</div>

				<div className='bPlBlockContentSidebar'>
					<BlockInspector />
				</div>
			</ShortcutProvider>
		</SlotFillProvider>
	</BlockEditorProvider>;
};
export default BlockContentEditor;

export const BlockContentModal = ({ isOpen, onClose, title = __('Edit Content'), ...editorProps }) => {
	if (!isOpen) {
		return null;
	}

	// Popovers from the nested editor can land outside the modal frame, so an outside click must not close it
	return <Modal className='bPlBlockContentModal' title={title} onRequestClose={onClose} shouldCloseOnClickOutside={false}>
		<BlockContentEditor {...editorProps} />
	</Modal>;
};
