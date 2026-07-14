export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Justflip",
    url: "https://justflip.in",
    logo: "https://justflip.in/logo.png",
    description: "The trusted Real Estate marketplace for new homes across India and Dubai.",
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Justflip",
    url: "https://justflip.in/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://justflip.in/properties?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://justflip.in${item.href}` : undefined,
    })),
  };
}

export function buildRealEstateSchema({ name, description, url, locationName, cityName, price }) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: name,
    description: description ? description.replace(/<[^>]+>/g, "") : "",
    url: `https://justflip.in${url}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: locationName,
      addressRegion: cityName,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: price || 0,
    },
  };
}

export function buildDeveloperSchema({ name, description, slug, logo }) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: name,
    description: description ? description.replace(/<[^>]+>/g, "") : "",
    url: `https://justflip.in/developers/${slug}`,
    image: logo || "",
  };
}

export function buildItemListSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
    })),
  };
}

export function buildFAQSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq?.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq?.answer,
      },
    })),
  };
}
