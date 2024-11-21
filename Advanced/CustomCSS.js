import { PanelBody } from '@wordpress/components';

import { CustomCodeEditor } from '../Components';
import { updateData } from '../utils/functions';

const CustomCSS = ({ css = '', onChange }) => {
	return <PanelBody className='bPlPanelBody' title='Custom CSS' initialOpen={false}>
		<CustomCodeEditor value={css} onChange={val => onChange(updateData(css, val))} />
	</PanelBody>
}
export default CustomCSS;