export function constructMetadata({
  title = "Find New Apartments, Villas & Plots Across India & Dubai | Real Estate - Justflip",
  description = "The trusted Real Estate marketplace for new homes. Easily compare apartments, villas, and plots from top developers across India and Dubai.",
  image = "https://justflip.in/logo.png",
  canonical = "/",
  noIndex = false,
  type = "website"
}) {
  const absoluteCanonical = canonical.startsWith('http') ? canonical : `https://justflip.in${canonical}`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteCanonical,
    },
    openGraph: {
      title,
      description,
      url: absoluteCanonical,
      siteName: 'Justflip',
      locale: 'en_IN',
      type,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
}
