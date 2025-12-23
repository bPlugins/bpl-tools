/**
 * CustomCodeEditor Component
 * 
 * @param {object} props - The props object
 * @param {string} props.value - The value of the code editor
 * @param {function} props.onChange - The function to handle changes in the code editor value
 * @param {string} props.height - The height of the code editor
 * @param {string} props.width - The width of the code editor
 * @returns {JSX.Element} React component
 */

import { useCallback, useRef } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/worker-css';
import 'ace-builds/src-noconflict/theme-monokai';
import "ace-builds/src-noconflict/worker-html";
import "ace-builds/src-noconflict/snippets/html";


const CustomCodeEditor = (props) => {
	const { value, onChange, height = '300px', width = '100%', wrap = false } = props;
	const id = Math.floor(Math.random() * 99999999);

	const timeoutRef = useRef(null);
	const debouncedOnChange = useCallback((newVal) => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => onChange(newVal), 600);
	}, [onChange]);

	return <div className="bPlCustomCodeEditor">
		<AceEditor
			mode="css"
			theme="monokai"
			name={`advEditor-${id}`}
			onChange={debouncedOnChange}
			fontSize={14}
			lineHeight={19}
			height={height}
			width={width}
			showPrintMargin
			showGutter
			highlightActiveLine
			wrapEnabled={wrap}
			value={value}
			setOptions={{
				useWorker: false,
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true,
				// choose one:
				// useWorker: false,
				showLineNumbers: true,
				tabSize: 2,
			}}
		/>
	</div>
}
export default CustomCodeEditor;