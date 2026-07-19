const BACKEND_URLS = [process.env.BACKEND_URL || 'http://localhost:3001', 'http://127.0.0.1:3001']

export default async function handler(req, res) {
  const { slug } = req.query
  const path = Array.isArray(slug) ? slug.join('/') : slug
  const method = req.method

  const headers = { ...req.headers }
  // Remove host header to avoid issues
  delete headers.host

  const body = ['GET', 'HEAD'].includes(method) ? undefined : JSON.stringify(req.body)

  let lastErr
  for (const base of BACKEND_URLS) {
    try {
      const backendRes = await fetch(`${base}/${path}`, { method, headers, body })
      const data = await backendRes.text()
      res.status(backendRes.status)
      for (const [k, v] of backendRes.headers.entries()) {
        if (k.toLowerCase() === 'transfer-encoding') continue
        res.setHeader(k, v)
      }
      return res.send(data)
    } catch (e) {
      lastErr = e
    }
  }
  console.error('forward proxy error', lastErr)
  res.status(502).json({ error: 'Bad gateway' })
}
