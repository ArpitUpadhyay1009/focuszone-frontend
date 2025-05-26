import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = 'FocusZone - Boost Your Productivity and Focus',
  description = 'Enhance your focus and productivity with FocusZone\'s powerful tools and tracking features.',
  keywords = 'focus timer, productivity, task management, pomodoro, time tracking, focus app',
  canonicalUrl = 'https://focuszone.io/',
  ogImage = 'https://focuszone.io/og-image.png'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;