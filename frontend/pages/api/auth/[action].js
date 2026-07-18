const BACKEND_URLS = [process.env.BACKEND_URL || 'http://localhost:3001', 'http://127.0.0.1:3001'];

async function proxyFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error?.cause?.code === 'ECONNREFUSED') {
      throw error;
    }
    throw error;
  }
}

export default async function handler(req, res) {
  const {
    query: { action },
    method,
    body,
  } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!['register', 'login', 'refresh', 'logout'].includes(action)) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  let lastError;

  for (const baseUrl of BACKEND_URLS) {
    try {
      const backendRes = await proxyFetch(`${baseUrl}/api/auth/${action}`, payload);
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    } catch (error) {
      lastError = error;
      console.warn(`Auth proxy failed for ${baseUrl}:`, error?.message || error);
      if (error?.cause?.code !== 'ECONNREFUSED') {
        break;
      }
    }
  }

  console.error('Auth proxy error:', lastError);
  return res.status(500).json({ error: 'Unable to reach backend auth service' });
}
