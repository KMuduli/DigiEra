import { Helmet } from 'react-helmet-async';
import { getImageUrl } from '../utils/image';

const SEOHead = ({ title, description, slug, image, type = 'article' }) => {
  const siteTitle = 'DigitalEra';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteUrl = window.location.origin;
  const url = slug ? `${siteUrl}/article/${slug}` : siteUrl;
  const finalImage = image ? getImageUrl(image) : `${siteUrl}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'DigitalEra - Modern Technology & Programming Blog'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEOHead;
