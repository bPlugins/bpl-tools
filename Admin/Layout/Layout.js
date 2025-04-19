import React from 'react';
import Content from '../Parts/Content';
import Header from '../Parts/Header';

const Layout = (props) => {
  const {children} =props;
  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: "Support", href: '/support'}
  ]


  return (
    <>
      <div className="bPlAdminLayoutContainer">
        <Header navigation={navigation} {...props} />
        <Content>{children}</Content>
      </div>
    </>
  )
}

export default Layout;