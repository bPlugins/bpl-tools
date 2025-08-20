import { checkIcon, minusIcon } from '../../utils/icons'

import './style.scss';

const FeatureCompare = (props) => {
	const { featureCompareInfo } = props;
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
							return <td key={id}>
								{featurePlans?.includes(id) ? checkIcon : minusIcon}
							</td>
						})}
					</tr>
				})}
			</tbody>
		</table>
	</div>
};
export default FeatureCompare;