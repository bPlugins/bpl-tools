import React, { useEffect, useState } from 'react';

/**
 * @props {string} value - The initial content of the editor
 * @props {function} onChange - The function to call when the content changes
 * @props {boolean} media_button - Whether to show the media button or not
 * @props {boolean} quicktags - Whether to show the quicktags button or not
 * @props {string} height - The height of the editor
 */

const TinyEditor = ({ value = '', onChange, media_button = true, quicktags = true, height = '180px' }) => {
	const [randomId, setEditorId] = useState(null);

	// Initialize randomId only once
	useEffect(() => {
		setEditorId(String(Math.floor(Math.random() * 99999)));
	}, []);

	// Main editor initialization and event handling
	useEffect(() => {
		if (!randomId) return;

		const editorSettings = {
			tinymce: {
				selector: `bpl-wp-${randomId}editor`,
				height,
				wpautop: false,
				plugins: 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
				toolbar1: 'formatselect bold italic underline bullist numlist blockquote alignleft aligncenter alignright link unlink wp_more fullscreen wp_adv',
				toolbar2: 'strikethrough hr alignjustify forecolor pastetext removeformat charmap outdent indent undo redo wp_help',
				setup(editor) {
					// Add setup function to handle various events
					editor.on('init', function () {
						editor.setContent(value);
					});

					// Handle all content changes
					const updateContent = () => {
						const content = editor.getContent();
						onChange(content);
					}

					// Add multiple event listeners for better content tracking
					editor.on('keyup', updateContent);
					editor.on('change', updateContent);
					editor.on('input', updateContent);
					editor.on('paste', updateContent);

					// Handle focus events
					// editor.on('focus', () => {
					//		editor.setContent(def);
					// });

					editor.on('blur', () => {
						const content = editor.getContent();
						if (content !== value) {
							onChange(content);
						}
					});
				}
			},
			quicktags,
			mediaButtons: media_button,
			paste_block_drop: true,
			paste_data_images: true,
			paste_as_text: true,
			content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
		};

		// Initialize editor
		wp.editor.initialize(`bpl-wp-${randomId}editor`, editorSettings);

		// Cleanup function
		return () => {
			const editor = window.tinymce.editors[`bpl-wp-${randomId}editor`];
			if (editor) {
				editor.off('keyup');
				editor.off('change');
				editor.off('input');
				editor.off('paste');
				editor.off('focus');
				editor.off('blur');
			}
			wp.editor.remove(`bpl-wp-${randomId}editor`);
		}
	}, [randomId]);

	// Handle content updates from props
	useEffect(() => {
		if (!randomId) return;
		const editor = window.tinymce.editors[`bpl-wp-${randomId}editor`];
		if (editor && value !== editor.getContent()) {
			editor.setContent(value);
		}
	}, [value, randomId]);

	return <div>
		<style>{`
				#bpl-wp-${randomId}editor{
					border:none !important;
				}
				#bpl-wp-${randomId}editor:focus{
					border:none !important;
					outline: none !important;
					box-shadow:none !important;
				}
			`}</style>

		<textarea
			style={{ width: '100%' }}
			id={`bpl-wp-${randomId}editor`}
			className='bpl-wp-editor'
		/>
	</div>
}
export default TinyEditor;