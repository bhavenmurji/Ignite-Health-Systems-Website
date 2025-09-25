import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  noindex?: boolean
}

export default function SEOHead({
  title = 'Ignite Health Systems - The Clinical Co-pilot for Independent Medicine',
  description = 'Revolutionary AI co-pilot that unifies your workflow, eliminates 60% of administrative overhead, and restores the vital time needed for clinical thought and patient connection.',
  keywords = 'healthcare AI, clinical copilot, physician burnout, EMR alternative, medical technology, independent medicine, direct primary care',
  image = '/api/og-image',
  url = 'https://ignitehealthsystems.com',
  type = 'website',
  noindex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('Ignite Health Systems') ? title : `${title} | Ignite Health Systems`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Dr. Bhaven Murji" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Ignite Health Systems" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@ignitehealthsys" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#00A8E8" />
      <meta name="msapplication-TileColor" content="#00A8E8" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Ignite Health" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Ignite Health Systems',
            url: 'https://ignitehealthsystems.com',
            logo: 'https://ignitehealthsystems.com/logo.png',
            foundingDate: '2024',
            founder: {
              '@type': 'Person',
              name: 'Dr. Bhaven Murji',
              jobTitle: 'Founder & CEO',
              alumniOf: {
                '@type': 'Organization',
                name: 'St. George\'s University of London'
              }
            },
            industry: 'Healthcare Technology',
            description: description,
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: 'contact@ignitehealthsystems.com'
            },
            sameAs: [
              'https://linkedin.com/company/ignite-health-systems',
              'https://twitter.com/ignitehealthsys'
            ]
          })
        }}
      />

      {/* Structured Data - WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Ignite Health Systems',
            url: 'https://ignitehealthsystems.com',
            description: description,
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://ignitehealthsystems.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
    </Head>
  )
}