/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://stackbyte.dev',
  generateRobotsTxt: true,
  exclude: ['/icon.svg'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}

