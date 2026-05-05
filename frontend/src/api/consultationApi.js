const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const CONSULTATION_PATH = `${BASE_URL}/consultations`;
const REQUEST_TIMEOUT_MS = 30000;

async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(`${CONSULTATION_PATH}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Server is taking too long to respond. Please wait a minute and try again.');
    }

    throw new Error('Unable to reach the server. Please check if the backend is live.');
  } finally {
    clearTimeout(timeoutId);
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = body?.message || response.statusText || 'An unexpected error occurred';
    throw new Error(message);
  }

  return body;
}

export async function getConsultations() {
  return request('/');
}

export async function createConsultation(data) {
  return request('/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function respondConsultation(id, data) {
  return request(`/${id}/respond`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateConsultation(id, data) {
  return request(`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteConsultation(id) {
  return request(`/${id}`, {
    method: 'DELETE',
  });
}
