/**
 * Badge Component
 * 
 * @props className (optional): '' (String)
 * @props label (optional): 'NEW' (String)
 * @props color (optional): '#ff7a00' (String)
 * @props background (optional): '#ff7a0020' (String)
 * @props borderColor (optional): '#ff7a0030' (String)
 */

import './style.scss';

export const Badge = ({ className = '', label = 'NEW', color = '#ff7a00', background = '#ff7a0020', borderColor = '#ff7a0030' }) => {
    return <span className={`bPlBadge ${className}`} style={{ color, background, borderColor }}>{label}</span>
};
export default Badge;