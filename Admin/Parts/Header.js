import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  const { navigation, version,title,logo } =props;

  return (
    <div className="dashboard-heading-container">
      <div className="dashboard-heading">
        <div className="heading">
          <img
            className="block-logo"
            src={logo}
            alt="CustomHtmlIcon"
          />
          <h1 className="heading-title">
            {title}
          </h1>
        </div>
        <div className="plugin-version">
          v{version}
        </div>
      </div>

      {/* Links */}
      <div className="navLinks">
        <div className='firstLinks'>
          {
            navigation.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  to={item.href}
                  className={`links ${({ isActive }) => isActive ? 'active' : ''}`}
                >
                  {item.name}
                </NavLink>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Header;