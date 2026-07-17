export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/'],
      },
      {
        userAgent: '*',
        disallow: '/search',  // Don't index search results
      },
    ],
    sitemap: 'https://justflip.in/sitemap.xml',
  }
}
