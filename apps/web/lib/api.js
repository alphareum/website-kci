export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = isFormData
    ? {
        ...(options.headers || {}),
      }
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch (err) {
      // ignore parsing error
    }
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  return data;
}

export function apiGet(path) {
  return request(path, { method: 'GET' });
}

export function apiPost(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiUpload(path, formData) {
  return request(path, {
    method: 'POST',
    body: formData,
  });
}

export function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}
