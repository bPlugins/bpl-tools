import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import UpgradeBtn from './UpgradeBtn';
import findBlock from '../assets/images/demo/findBlock-min.png';
import { FiCornerLeftDown } from '../utils/icon';
import { listIcon } from '../../utils/icons';

const Dashboard = (props) => {
  const { title, features, isPremium, options,freemius,logo,demoImg} = props;
  const [content, setContent] = useState("");



  useEffect(() => {
    setContent(options[0])
  }, [options])

  return (
    <Layout {...props} >
      <div className="feature-section">
        {
          isPremium ? (
            <>
              <div className='premium-section'>
                <div className='premium-header'>
                  <h1>🎉 Thank you for installing the Premium Version <span className='bPlPluginName'>{title} Plugin!</span></h1>
                </div>
                <div className='premium-image'>
                  <img src={demoImg} alt="find-block" />
                </div>

              </div>
            </>
          ) : (
            <>
              {/* Demo Section */}
              <div className='tab-section'>
                <div className='dashboard-header-main-section'>
                  <div className="dashboard-header-section">
                    <h1>Thank you for installing the <span className='bPlPluginName'>{title} Plugin!</span></h1>
                    <div className='premium-head'>
                      <FiCornerLeftDown className="leftDownIcon" />
                      <h3>Check out some of our amazing premium themes below.</h3>
                    </div>
                  </div>
                  <div>
                    <UpgradeBtn freemius={freemius} image={logo} />
                  </div>
                </div>
                <div className="tab-container">
                  <nav className="tabs">
                    <h2 className='ul-head'>Amazing themes:</h2>
                    <ul className="tab-list">
                      {options.map((tab, i) => (
                        <li
                          key={i}
                          className={`tab-item ${content.label === tab.label ? 'active' : ''}`}
                          onClick={() => setContent(tab)}
                        >
                          <div className="tab-content">
                            {listIcon}
                            <span className="tab-label">{tab.label}</span>
                            {tab.isPremium && <span className="pro-badge">Pro</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  {
                    content.content && <main className="content" dangerouslySetInnerHTML={{ __html: content.content.outerHTML }}>
                      {/* Render the dynamic theme content */}
                      {/* <div className="theme-content"  /> */}
                    </main>
                  }
                </div>
              </div>

              {/* Pro features */}
              <div className="feature-container">
                <div className="feature-grid">
                  <div className="feature-content">
                    <p className="section-heading">Awesome Premium Features</p>
                    <p className="section-description">
                      Expand your plugin with some awesome some premium features that will give you a better experience.
                    </p>

                    {/* Premium Feature List */}
                    <div className="feature-list">
                      {features.map((feature,i) => (
                        <div key={i} className="feature-item">
                          <div className="feature-name">
                            {feature.title}
                          </div>
                          <div className="feature-description">{feature.description}</div>
                        </div>
                      ))}
                    </div>

                    <div className="upgrade-btn">
                      <UpgradeBtn freemius={freemius} image={logo}/>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    </Layout>
  );
};

export default Dashboard;