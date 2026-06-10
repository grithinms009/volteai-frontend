const API_BASE = import.meta.env.VITE_API_URL || 'http://95.217.223.40:3000';

export { API_BASE };

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiCall = async <T = any>(path: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  // Remove Content-Type for FormData
  if (options?.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/';
      throw new ApiError('Session expired. Please sign in again.', 401, res);
    }
    
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new ApiError(errorText || `HTTP ${res.status}`, res.status, res);
  }

  // Handle empty responses
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text() as unknown as T;
};

export const apiUpload = async <T = any>(
  path: string, 
  formData: FormData
): Promise<T> => {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/';
      throw new ApiError('Session expired. Please sign in again.', 401, res);
    }
    
    const errorText = await res.text().catch(() => 'Upload failed');
    throw new ApiError(errorText || `HTTP ${res.status}`, res.status, res);
  }

  return res.json();
};

export default apiCall;
