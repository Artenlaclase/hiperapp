const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

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

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);
  } catch (error) {
    console.error('Auth proxy error:', error);
    return res.status(500).json({ error: 'Unable to reach backend auth service' });
  }
}
