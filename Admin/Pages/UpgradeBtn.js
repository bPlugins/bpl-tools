import { Sparkles } from '../utils/icon';
import './UpgradeBtn.scss';
import '../assets/js/fs.js';

const UpgradeBtn = ({freemius,image}) => {
  const {product_id,plan_id,public_key,title,licenses} =freemius
  const onUpgrade = (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-undef
    const checkoutConfig = new FS.Checkout({
      product_id,
      plan_id,
      public_key,
      image
    });

    checkoutConfig.open({
      title,
      licenses,
    });
    e.preventDefault();
  }

  return <button onClick={onUpgrade} className='premium-button'>
    <span className="button-background"></span>
    <span className="button-shine"></span>
    <span className="button-overlay"></span>
    <span className="button-glow"></span>
    <span className="button-content">
      <Sparkles className="sparkle-icon" />
      Buy Now
    </span>
  </button>
}

export default UpgradeBtn;