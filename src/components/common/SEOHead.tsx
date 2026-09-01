import React, { useEffect } from 'react';
import { Article } from '../../types.ts';
import { useNews } from '../../context/NewsContext.tsx';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  image?: string;
  article?: Article;
  canonicalUrl?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  ogImage,
  image,
  article,
  canonicalUrl,
  type,
  author,
  publishedTime,
  modifiedTime,
  category,
  tags,
}) => {
  const { settings } = useNews();

  const siteTitle = settings?.siteName || 'সত্যবাণী';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} — ${settings?.siteTagline || ''}`;
  const finalDesc = description || (article ? article.excerpt : settings?.seoDefaults?.metaDescription || '');
  const finalImage = image || ogImage || (article ? article.featuredImage : settings?.seoDefaults?.defaultOgImage || '');
  const finalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');


  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      let el = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      );
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', finalDesc);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', finalDesc, true);
    setMeta('og:image', finalImage, true);
    setMeta('og:url', finalUrl, true);
    setMeta('og:type', article ? 'article' : 'website', true);
    setMeta('og:site_name', siteTitle, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', finalImage);

    // Schema.org Structured Data
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (article) {
      const newsArticleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt,
        image: [article.featuredImage],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: [
          {
            '@type': 'Person',
            name: article.authorName,
          },
        ],
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: siteTitle,
          url: window.location.origin,
          logo: {
            '@type': 'ImageObject',
            url: finalImage,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': finalUrl,
        },
      };
      scriptTag.text = JSON.stringify(newsArticleSchema);
    } else {
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        name: siteTitle,
        url: window.location.origin,
        logo: finalImage,
        sameAs: Object.values(settings.socialLinks || {}).filter(Boolean),
      };
      scriptTag.text = JSON.stringify(organizationSchema);
    }
  }, [fullTitle, finalDesc, finalImage, finalUrl, article, siteTitle, settings]);

  return null;
};
