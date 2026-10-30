/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://stackbyte.dev',
  generateRobotsTxt: true,
  exclude: ['/icon.svg', '/**/opengraph-image', '/feed.xml', '/.well-known/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}

