import React from 'react';

const HelpfulLinks = ({support}) => {
  return <>
    <div className='header box'>
      <h1 className='heading'>Helpful Links</h1>
    </div>
    <div className='body'>
      <div className='features col-3 col-tab-2 col-mob-1'>
        {support?.map((feature, index) => <Link key={index} feature={feature} />)}
      </div>
    </div>
  </>
};

export default HelpfulLinks;

const Link = ({ feature }) => {
  const { title, description, icon, link, linkText } = feature;

  return <div className='feature box'>
    <div className='bPl-dashboard-helpIcon'>{icon}</div>
    <h3 dangerouslySetInnerHTML={{ __html: title }} />
    <p dangerouslySetInnerHTML={{ __html: description }} />
    <a href={link} target='_blank' rel='noreferrer' className='button button-primary' dangerouslySetInnerHTML={{ __html: linkText }} />
  </div>
}