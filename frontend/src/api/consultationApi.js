const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const CONSULTATION_PATH = `${BASE_URL}/consultations`;

async function request(endpoint, options = {}) {
  const response = await fetch(`${CONSULTATION_PATH}${endpoint}`, options);
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
