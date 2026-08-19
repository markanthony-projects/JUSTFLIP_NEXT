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

export function buildBreadcrumbSchema(items: Array<{ label: string; href?: string }> = []) {
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

export interface RealEstateSchemaProps {
  name: string;
  description?: string;
  url: string;
  locationName: string;
  cityName: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  priceCurrency?: string;
  numberOfRooms?: number;
  floorSize?: number;
  yearBuilt?: number | string;
  amenities?: Array<string | { name?: string; [key: string]: any }>;
  latitude?: number | string;
  longitude?: number | string;
  images?: string[];
  availability?: string;
  reraNumber?: string;
  ratingValue?: number | string;
  reviewCount?: number | string;
}

export function buildRealEstateSchema({ 
  name, 
  description, 
  url, 
  locationName, 
  cityName, 
  price,
  minPrice,
  maxPrice,
  priceCurrency = "INR",
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
}: RealEstateSchemaProps) {
  const effectiveMin = minPrice ?? price ?? 0;
  const effectiveMax = maxPrice ?? price ?? effectiveMin;

  const offersObj: Record<string, any> = (effectiveMax > effectiveMin)
    ? {
        "@type": "AggregateOffer",
        priceCurrency: priceCurrency,
        lowPrice: effectiveMin,
        highPrice: effectiveMax,
        price: effectiveMin,
        offerCount: numberOfRooms || 1,
      }
    : {
        "@type": "Offer",
        priceCurrency: priceCurrency,
        price: effectiveMin,
      };

  if (availability) {
    offersObj.availability = availability === 'PreOrder' 
      ? "https://schema.org/PreOrder" 
      : "https://schema.org/InStock";
  }

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: name,
    description: description ? description.replace(/<[^>]+>/g, "").trim() : "",
    url: `https://justflip.in${url}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: locationName,
      addressRegion: cityName,
      addressCountry: "IN",
    },
    offers: offersObj,
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
      name: typeof a === "string" ? a : (a as any)?.name || String(a),
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
    schema.image = images.filter(Boolean);
  }

  if (reraNumber) {
    schema.additionalProperty = [{
      "@type": "PropertyValue",
      name: "RERA Number",
      value: reraNumber
    }];
  }

  const numericRating = Number(ratingValue);
  const numericCount = Number(reviewCount);
  if (!isNaN(numericRating) && numericRating > 0 && !isNaN(numericCount) && numericCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: numericRating.toFixed(1),
      reviewCount: numericCount,
      bestRating: "5",
      worstRating: "1"
    };
  }

  return schema;
}

export interface DeveloperSchemaProps {
  name: string;
  description?: string;
  slug: string;
  logo?: string;
  image?: string;
  startedAt?: number | string;
  totalProjects?: number;
  activeProjects?: number;
  address?: string | {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  telephone?: string;
  email?: string;
  priceRange?: string;
  employees?: Array<{
    name: string;
    designation?: string;
    image?: string;
  }>;
  ratingValue?: number | string;
  reviewCount?: number | string;
  sameAs?: string[];
  areaServed?: string | string[];
}

export function buildDeveloperSchema({
  name,
  description,
  slug,
  logo,
  image,
  startedAt,
  totalProjects,
  activeProjects,
  address,
  telephone,
  email,
  priceRange = "₹₹ - ₹₹₹₹",
  employees,
  ratingValue,
  reviewCount,
  sameAs,
  areaServed = "India",
}: DeveloperSchemaProps) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: name,
    url: `https://justflip.in/developers/${slug}`,
    description: description ? description.replace(/<[^>]+>/g, "").trim() : "",
    currenciesAccepted: "INR",
    priceRange,
  };

  const images: string[] = [];
  if (logo) images.push(logo);
  if (image && image !== logo) images.push(image);

  if (images.length > 0) {
    schema.image = images.length === 1 ? images[0] : images;
    if (logo) {
      schema.logo = logo;
    }
  }

  if (startedAt) {
    schema.foundingDate = String(startedAt);
  }

  if (areaServed) {
    schema.areaServed = Array.isArray(areaServed)
      ? areaServed.map((area) => ({
          "@type": "AdministrativeArea",
          name: area,
        }))
      : {
          "@type": "Country",
          name: areaServed,
        };
  }

  if (telephone) {
    schema.telephone = telephone;
  }

  if (email) {
    schema.email = email;
  }

  if (address) {
    if (typeof address === "string") {
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: address,
        addressCountry: "IN",
      };
    } else {
      schema.address = {
        "@type": "PostalAddress",
        ...address,
        addressCountry: address.addressCountry || "IN",
      };
    }
  } else {
    schema.address = {
      "@type": "PostalAddress",
      addressCountry: "IN",
    };
  }

  if (employees && employees.length > 0) {
    schema.employee = employees.map((emp) => ({
      "@type": "Person",
      name: emp.name,
      ...(emp.designation ? { jobTitle: emp.designation } : {}),
      ...(emp.image ? { image: emp.image } : {}),
    }));
  }

  if (sameAs && sameAs.length > 0) {
    schema.sameAs = sameAs.filter(Boolean);
  }

  const additionalProps: Array<{ "@type": string; name: string; value: any }> = [];
  if (totalProjects !== undefined) {
    additionalProps.push({
      "@type": "PropertyValue",
      name: "Total Projects",
      value: totalProjects,
    });
  }
  if (activeProjects !== undefined) {
    additionalProps.push({
      "@type": "PropertyValue",
      name: "Active Projects",
      value: activeProjects,
    });
  }
  if (additionalProps.length > 0) {
    schema.additionalProperty = additionalProps;
  }

  schema.knowsAbout = [
    "Real Estate Development",
    "Residential Properties",
    "Commercial Properties",
    "Construction & Property Architecture",
  ];

  const numericRating = Number(ratingValue);
  const numericCount = Number(reviewCount);
  if (!isNaN(numericRating) && numericRating > 0 && !isNaN(numericCount) && numericCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: numericRating.toFixed(1),
      reviewCount: numericCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

export function buildItemListSchema(items: Array<{ url: string }> = []) {
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

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }> = []) {
  if (!faqs || !Array.isArray(faqs) || !faqs.length) return null;
  const validFaqs = faqs.filter((faq) => faq?.question && faq?.answer);
  if (!validFaqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map((faq) => ({
      "@type": "Question",
      name: typeof faq.question === "string" ? faq.question.trim() : String(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof faq.answer === "string" ? faq.answer.replace(/<[^>]+>/g, "").trim() : String(faq.answer),
      },
    })),
  };
}

export function buildSearchResultsSchema(results: any[] = [], query: string = '') {
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

export interface LocalBusinessSchemaProps {
  name?: string;
  telephone?: string;
  openingHours?: string;
  address?: any;
  latitude?: string;
  longitude?: string;
  sameAs?: string[];
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
}: LocalBusinessSchemaProps = {}) {
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

function formatIsoDate(d?: string | number | Date): string | undefined {
  if (!d) return undefined;
  try {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  } catch {
    // fallback
  }
  return typeof d === "string" ? d : undefined;
}

export interface ArticleSchemaProps {
  title: string;
  url?: string;
  publishDate?: string | number | Date;
  updateDate?: string | number | Date;
  coverImage?: string;
  images?: string[];
  shortDescription?: string;
  authorName?: string;
  authorType?: "Person" | "Organization";
  publisherName?: string;
  publisherLogo?: string;
  articleSection?: string;
  keywords?: string | string[];
}

export function buildArticleSchema({
  title,
  url,
  publishDate,
  updateDate,
  coverImage,
  images,
  shortDescription,
  authorName = "JustFlip",
  authorType = "Organization",
  publisherName = "JustFlip",
  publisherLogo = "https://justflip.in/logo.png",
  articleSection,
  keywords,
}: ArticleSchemaProps) {
  const published = formatIsoDate(publishDate) || (publishDate ? String(publishDate) : undefined);
  const modified = formatIsoDate(updateDate) || published;

  const imageList: string[] = [];
  if (coverImage) imageList.push(coverImage);
  if (images && images.length > 0) {
    images.forEach((img) => {
      if (img && !imageList.includes(img)) {
        imageList.push(img);
      }
    });
  }

  const cleanDescription = shortDescription ? shortDescription.replace(/<[^>]+>/g, "").trim() : "";

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting"],
    headline: title ? title.replace(/<[^>]+>/g, "").trim() : "",
    ...(cleanDescription ? { description: cleanDescription } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(url
      ? {
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url.startsWith("http") ? url : `https://justflip.in${url.startsWith("/") ? "" : "/"}${url}`,
          },
        }
      : {}),
    author: {
      "@type": authorType,
      name: authorName,
      ...(authorType === "Organization" ? { url: "https://justflip.in" } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: "https://justflip.in",
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
  };

  if (imageList.length > 0) {
    schema.image = imageList.length === 1 ? imageList[0] : imageList;
  }

  if (articleSection) {
    schema.articleSection = articleSection;
  }

  if (keywords) {
    schema.keywords = Array.isArray(keywords) ? keywords.join(", ") : keywords;
  }

  return schema;
}

export type BlogPostingSchemaProps = ArticleSchemaProps;
export const buildBlogPostingSchema = buildArticleSchema;

export interface VideoObjectSchemaProps {
  name: string;
  description?: string;
  thumbnailUrl?: string | string[];
  uploadDate?: string | number | Date;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
  publisherName?: string;
  publisherLogo?: string;
}

export function buildVideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
  publisherName = "JustFlip",
  publisherLogo = "https://justflip.in/logo.png",
}: VideoObjectSchemaProps) {
  const uploadIso = formatIsoDate(uploadDate) || (uploadDate ? String(uploadDate) : new Date().toISOString());

  const thumbnails = Array.isArray(thumbnailUrl) 
    ? thumbnailUrl.filter(Boolean) 
    : (thumbnailUrl ? [thumbnailUrl] : []);

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: name ? name.replace(/<[^>]+>/g, "").trim() : "Property Video Tour",
    description: description
      ? description.replace(/<[^>]+>/g, "").trim()
      : `Watch property walkthrough and video tour for ${name || "this property"} on JustFlip.`,
    thumbnailUrl:
      thumbnails.length > 0 ? (thumbnails.length === 1 ? thumbnails[0] : thumbnails) : "https://justflip.in/logo.png",
    uploadDate: uploadIso,
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
  };

  if (contentUrl) {
    schema.contentUrl = contentUrl;
  }

  if (embedUrl) {
    schema.embedUrl = embedUrl;
  } else if (
    contentUrl &&
    (contentUrl.includes("youtube.com") || contentUrl.includes("youtu.be") || contentUrl.includes("vimeo.com"))
  ) {
    schema.embedUrl = contentUrl;
  }

  if (duration) {
    schema.duration = duration;
  }

  return schema;
}

export interface ReviewSchemaProps {
  itemReviewedName: string;
  itemReviewedType?: "RealEstateListing" | "Place" | "Product" | "LocalBusiness" | string;
  ratingValue: number | string;
  reviewBody?: string;
  authorName?: string;
  datePublished?: string | number | Date;
  publisherName?: string;
}

export function buildReviewSchema({
  itemReviewedName,
  itemReviewedType = "Place",
  ratingValue,
  reviewBody,
  authorName = "Anonymous",
  datePublished,
  publisherName = "JustFlip",
}: ReviewSchemaProps) {
  const publishedIso = formatIsoDate(datePublished);

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": itemReviewedType,
      name: itemReviewedName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: Number(ratingValue) || 5,
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Person",
      name: authorName || "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
    },
  };

  if (reviewBody) {
    schema.reviewBody = reviewBody.replace(/<[^>]+>/g, "").trim();
  }

  if (publishedIso) {
    schema.datePublished = publishedIso;
  }

  return schema;
}

export function buildReviewsSchemaList({
  itemReviewedName,
  itemReviewedType = "Place",
  reviews,
}: {
  itemReviewedName: string;
  itemReviewedType?: string;
  reviews: any[];
}) {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return null;

  const validReviews = reviews.filter((r) => {
    const comment = r?.comment || r?.description || r?.text;
    const rating = r?.rating ?? r?.stars;
    return comment || (rating && Number(rating) > 0);
  });

  if (validReviews.length === 0) return null;

  const schemas = validReviews.slice(0, 20).map((r) => {
    const author = r?.reviewer?.name || r?.userName || r?.name || "Verified User";
    const comment = (r?.comment || r?.description || r?.text || "").trim();
    const rating = Number(r?.rating ?? r?.stars ?? 5);

    return buildReviewSchema({
      itemReviewedName,
      itemReviewedType,
      ratingValue: rating,
      reviewBody: comment,
      authorName: author,
      datePublished: r?.createdAt || r?.date || r?.created_at,
    });
  });

  return schemas.length === 1 ? schemas[0] : schemas;
}



