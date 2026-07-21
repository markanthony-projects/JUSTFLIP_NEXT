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
      target: "https://justflip.in/search?q={search_term_string}",
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

export function buildRealEstateSchema({ 
  name, 
  description, 
  url, 
  locationName, 
  cityName, 
  price,
  numberOfRooms,
  floorSize,
  yearBuilt,
  amenities,
  latitude,
  longitude,
  images,
  availability,
  reraNumber,
  ratingValue,
  reviewCount
}) {
  const schema = {
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

  if (numberOfRooms) {
    schema.numberOfRooms = {
      "@type": "QuantitativeValue",
      value: numberOfRooms,
    };
  }

  if (floorSize) {
    schema.floorSize = {
      "@type": "QuantitativeValue",
      value: floorSize,
      unitText: "SQFT",
    };
  }

  if (yearBuilt) {
    schema.dateCreated = String(yearBuilt);
  }

  if (amenities && amenities.length > 0) {
    schema.amenityFeature = amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    }));
  }

  if (latitude && longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: latitude,
      longitude: longitude,
    };
  }

  if (images && images.length > 0) {
    schema.image = images;
  }

  if (availability) {
    schema.offers.availability = availability === 'PreOrder' 
      ? "https://schema.org/PreOrder" 
      : "https://schema.org/InStock";
  }

  if (reraNumber) {
    schema.additionalProperty = [{
      "@type": "PropertyValue",
      name: "RERA Number",
      value: reraNumber
    }];
  }

  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1"
    };
  }

  return schema;
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

export function buildSearchResultsSchema(results = [], query = '') {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Search results for "${query}" on Justflip`,
    numberOfItems: results.length,
    itemListElement: results.slice(0, 10).map((item, index) => {
      // Basic formatting for url
      const slug = item.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const locSlug = item.location?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const citySlug = item.city?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const zoneSlug = item.zone?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      
      const url = `https://justflip.in/properties/${citySlug}/${zoneSlug}/${locSlug}/${slug}-${item.id}`;
      
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "RealEstateListing",
          name: item.name,
          url,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: item.minPrice || 0,
          },
        },
      };
    }),
  };
}

export function buildLocalBusinessSchema({
  name = "JustFlip",
  telephone = "+918431362126",
  openingHours = "Mo-Su 09:30-18:30",
  address = {
    "@type": "PostalAddress",
    "streetAddress": "JustFlip Headquarters",
    "addressLocality": "Bangalore",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  latitude = "12.9716",
  longitude = "77.5946",
  sameAs = [
    "https://www.facebook.com/justflip",
    "https://www.instagram.com/justflip",
    "https://www.youtube.com/justflip"
  ]
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    address,
    telephone,
    openingHours,
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    sameAs,
  };
}

export function buildBlogPostingSchema({
  title,
  publishDate,
  updateDate,
  coverImage,
  shortDescription,
  authorName = "JustFlip",
  publisherName = "JustFlip"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: publishDate,
    dateModified: updateDate || publishDate,
    author: {
      "@type": "Organization",
      name: authorName
    },
    publisher: {
      "@type": "Organization",
      name: publisherName
    },
    image: coverImage,
    description: shortDescription
  };
}
