let config
const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  config = require('./prod.env.js')
} else {
  config = require('./dev.env.js')
}

export default config
