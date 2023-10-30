module.exports = {
  output: 'export',
  images: {
    domains: ['a.storyblok.com'],
  },
  env: {
    storyblokApiToken: process.env.STORYBLOK_API_TOKEN,
  },
}