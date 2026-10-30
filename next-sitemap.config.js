/** @type {import('next-sitemap').IConfig} */
const aiLog = require('./src/data/ai-log.json');
const lab = require('./src/data/lab.json');

// Real modification dates per URL. Everything else gets no lastmod: Google ignores lastmod when every
// URL claims the build date, and an honest "unknown" is better than a wrong date.
const lastmodByPath = {};
const seen = new Map();
[...aiLog.entries].sort((a, b) => a.date.localeCompare(b.date)).forEach((entry) => {
  const n = (seen.get(entry.date) ?? 0) + 1;
  seen.set(entry.date, n);
  lastmodByPath[`/ai-log/${n === 1 ? entry.date : `${entry.date}-${n}`}`] = entry.date;
});
lab.tools.forEach((tool) => {
  lastmodByPath[`/lab/${tool.slug}`] = tool.date;
});
const newest = (paths) => paths.map((p) => lastmodByPath[p]).filter(Boolean).sort().pop();
lastmodByPath['/ai-log'] = newest(Object.keys(lastmodByPath).filter((p) => p.startsWith('/ai-log/')));
lastmodByPath['/lab'] = newest(Object.keys(lastmodByPath).filter((p) => p.startsWith('/lab/')));

module.exports = {
  siteUrl: 'https://stackbyte.dev',
  generateRobotsTxt: true,
  autoLastmod: false,
  changefreq: undefined,
  priority: undefined,
  exclude: ['/icon.svg', '/**/opengraph-image', '/feed.xml', '/.well-known/*'],
  transform: async (config, path) => ({
    loc: path,
    lastmod: lastmodByPath[path] ? `${lastmodByPath[path]}T12:00:00.000Z` : undefined,
  }),
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
}
