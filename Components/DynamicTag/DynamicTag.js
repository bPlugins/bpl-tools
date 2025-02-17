
/**
 * DynamicTag component
 * @param {string} tagName - The tag name of the component
 * @param {Object} props - The props of the component
 * @returns {ReactElement} - The dynamic tag component
 */

const DynamicTag = ({ tagName: DynamicTag, ...props }) => {
	return <DynamicTag {...props}></DynamicTag>;
};
export default DynamicTag;