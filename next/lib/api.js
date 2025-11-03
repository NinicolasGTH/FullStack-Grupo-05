let TOKEN = null;

export function setToken(t){ TOKEN = t; }
export function clearToken(){ TOKEN = null; }

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request(path, { method = 'GET', body, headers = {} } = {}){
  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
}

export const apiGet = (p) => request(p);
export const apiPost = (p, b) => request(p, { method: 'POST', body: b });
export const apiPut = (p, b) => request(p, { method: 'PUT', body: b });
export const apiDel = (p) => request(p, { method: 'DELETE' });
