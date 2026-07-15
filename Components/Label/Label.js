/**
	* Label Component
	*
	* @props className (optional): 'mt20 mb5' (String)
	* @props htmlFor (optional): The id of the associated form element (String)
	* @props children (required): Label content (Node)
	*/

const Label = props => {
	const { className = 'mt20 mb5', htmlFor, children } = props;

	return <label className={`bPlLabel ${className}`} htmlFor={htmlFor}>{children}</label>
};
export default Label;