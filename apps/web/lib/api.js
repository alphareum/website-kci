export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const hasBody = options.body !== undefined;
  const headers = isFormData
    ? {
        ...(options.headers || {}),
      }
    : hasBody
    ? {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      }
    : {
        ...(options.headers || {}),
      };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Send HttpOnly cookies with requests
  });

  if (!response.ok) {
    // Handle session expiration (401 Unauthorized)
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear any local session data
        window.localStorage.removeItem('kci_admin_session');
        // Redirect to login page
        window.location.href = '/cms/login';
      }
      throw new Error('Session expired. Please login again.');
    }

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

export function apiPatch(path, body) {
  return request(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
