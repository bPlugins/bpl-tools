import React from 'react';
import Layout from '../Layout/Layout';
import HelpfulLinks from './HelpfulLinks';

const Support = (props) => {
  const {support} =props;

  return (
    <Layout {...props}>
      <div className='support-section'>
        <div className='support-container'>
          <HelpfulLinks support={support} />
        </div>
      </div>
    </Layout>
  );
};

export default Support;