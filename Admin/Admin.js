import React from 'react';
import { HashRouter } from 'react-router-dom';

/**
 * Admin component for Image Compare Block
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Plugin name
 * @param {array} props.features - Plugin features
 * @param {string} props.version - Plugin version
 * @param {boolean} props.isPremium - Is plugin premium
 * @param {array} props.options - Plugin Options
 * @param {logo} props.logo - Plugin Logo
 *
 * @return {React.Component} Admin component
 */


import App from './App';

const Admin = (props) => {
  // const {title, features=[], version, isPremium, options=[],logo="" } = props;
  return (
    <HashRouter>
      <App {...props} />
    </HashRouter>
  );
}

export default Admin;