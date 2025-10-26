module.exports = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
  images: {
    domains: ['your-image-domain.com'], // Replace with your image domain
  },
};