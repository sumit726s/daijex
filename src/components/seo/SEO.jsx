import React from 'react';

const SEO = ({ metatags, fallbackTitle = 'Daijex Auto Industries' }) => {
  if (!metatags || !Array.isArray(metatags) || metatags.length === 0) {
    return <title>{fallbackTitle}</title>;
  }

  return (
    <>
      {metatags.map((tagObj, index) => {
        // 1. DRUPAL FIX: Convert <meta name="title"> into a real <title> tag
        if (tagObj.tag === 'meta' && tagObj.attributes?.name === 'title') {
          return <title key={`title-${index}`}>{tagObj.attributes.content}</title>;
        }

        // 2. Render standard <title> tags just in case
        if (tagObj.tag === 'title') {
          return <title key={`title-${index}`}>{tagObj.value || tagObj.attributes?.content}</title>;
        }

        // 3. Render all other <meta> tags (description, keywords, robots)
        if (tagObj.tag === 'meta') {
          return <meta key={`meta-${index}`} {...tagObj.attributes} />;
        }

        // 4. Render <link> tags (canonical URLs)
        if (tagObj.tag === 'link') {
          const attributes = { ...tagObj.attributes };
          
          // Strip '/api' out of the href so it points to the correct frontend URL
          if (attributes.href) {
            attributes.href = attributes.href.replace('/api', '').replace('/node', '/');;
          }
          
          return <link key={`link-${index}`} {...attributes} />;
        }

        return null;
      })}
    </>
  );
};

export default SEO;