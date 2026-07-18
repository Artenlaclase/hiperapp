let config = { reactStrictMode: true }

try {
  const withPWA = require('next-pwa')({ dest: 'public', disable: process.env.NODE_ENV === 'development' })
  module.exports = withPWA(config)
} catch (e) {
  module.exports = config
}
