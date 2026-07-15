/**
	* FeatureCompare Component
	*
	* @props featureCompareInfo (required): Comparison data with title, plans and features (Object)
	* @props isPremium (optional): false - hides the Buy Now row when true (Boolean)
	*/

import { checkIcon, closeIcon } from '../../utils/icons'
import Button from "../../Components/Button/Button"

import './style.scss';

const FeatureCompare = (props) => {
	const { featureCompareInfo, isPremium = false } = props;
	const { title, plans, features } = featureCompareInfo;

	return <div className='bPlDashboardFeatureCompare bPlDashboardBox'>
		<table>
			<thead>
				<tr>
					{title && <th dangerouslySetInnerHTML={{ __html: title }} />}

					{plans?.map(plan => {
						const { id, name, color } = plan;
						return <th key={id} style={{ color }} dangerouslySetInnerHTML={{ __html: name }} />
					})}
				</tr>
			</thead>

			<tbody>
				{features?.map((feature, index) => {
					const { label, plans: featurePlans } = feature;

					return <tr key={index}>
						<td dangerouslySetInnerHTML={{ __html: label }} />

						{plans?.map(plan => {
							const { id } = plan;
							return <td key={id} className={`icon ${featurePlans?.includes(id) ? 'check' : 'cross'}`}>
								{featurePlans?.includes(id) ? checkIcon : closeIcon}
							</td>
						})}
					</tr>
				})}

				{!isPremium && <tr>
					<td />
					<td />
					<td>
						<Button href='#pricing'>Buy Now</Button>
					</td>
				</tr>}
			</tbody>
		</table>
	</div>
};
export default FeatureCompare;