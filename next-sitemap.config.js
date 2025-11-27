/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://stackbyte.dev',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}

