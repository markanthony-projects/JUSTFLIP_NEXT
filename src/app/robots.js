export default function robots() {
  const commonDisallow = [
    '/admin/', 
    '/private/', 
    '/api/', 
    '/search', 
    '/wishlist/', 
    '/profile/', 
    '/settings/', 
  ];

  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: commonDisallow,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallow,
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://justflip.in/sitemap.xml',
  }
}
