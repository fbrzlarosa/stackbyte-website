/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://stackbyte.dev',
  generateRobotsTxt: true,
  exclude: ['/icon.svg', '/**/opengraph-image', '/feed.xml'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}

