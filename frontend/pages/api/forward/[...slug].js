const http = require('http')
const https = require('https')

const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1'
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || '3001', 10)

// Cabeceras que no se deben reenviar al backend
const HOP_BY_HOP = new Set([
  'host', 'connection', 'content-length', 'transfer-encoding',
  'te', 'trailers', 'upgrade', 'proxy-authorization', 'proxy-connection',
  'keep-alive',
])

function proxyRequest(req, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: `/api/${path}`,
      method: req.method,
      headers: {},
      timeout: 10000,
    }

    // Copiar cabeceras del request original, excepto las hop-by-hop
    for (const [k, v] of Object.entries(req.headers)) {
      if (!HOP_BY_HOP.has(k.toLowerCase())) {
        options.headers[k] = v
      }
    }

    // Forzar cabecera Content-Type para POST/PUT con body
    if (body && !options.headers['content-type']) {
      options.headers['content-type'] = 'application/json'
    }

    // Forzar Accept-Encoding a identity para evitar respuestas comprimidas
    options.headers['accept-encoding'] = 'identity'

    if (body) {
      const bodyBuf = Buffer.from(body, 'utf8')
      options.headers['content-length'] = bodyBuf.length
    }

    const client = BACKEND_PORT === 443 ? https : http
    const proxyReq = client.request(options, (proxyRes) => {
      const chunks = []
      proxyRes.on('data', (chunk) => chunks.push(chunk))
      proxyRes.on('end', () => {
        resolve({
          status: proxyRes.statusCode,
          headers: proxyRes.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        })
      })
      proxyRes.on('error', reject)
    })

    proxyReq.on('error', reject)
    proxyReq.on('timeout', () => {
      proxyReq.destroy()
      reject(new Error('Backend request timed out'))
    })

    if (body) {
      proxyReq.write(body)
    }
    proxyReq.end()
  })
}

export default async function handler(req, res) {
  const { slug } = req.query
  const path = Array.isArray(slug) ? slug.join('/') : slug

  const body = ['GET', 'HEAD'].includes(req.method)
    ? null
    : JSON.stringify(req.body)

  try {
    const result = await proxyRequest(req, path, body)

    res.status(result.status)

    // Reenviar cabeceras de respuesta del backend
    for (const [k, v] of Object.entries(result.headers)) {
      const kl = k.toLowerCase()
      if (kl === 'transfer-encoding') continue
      try {
        res.setHeader(k, v)
      } catch (_) { /* ignorar cabeceras inválidas */ }
    }

    res.send(result.body)
  } catch (err) {
    console.error('[proxy] Error conectando al backend:', err.message)
    res.status(502).json({
      error: 'Backend no disponible',
      detail: err.message,
      backend: `${BACKEND_HOST}:${BACKEND_PORT}`,
    })
  }
}
