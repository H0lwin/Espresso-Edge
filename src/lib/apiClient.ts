
// Helper function to get a cookie by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Cookies are not available in server-side rendering
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

interface RequestOptions extends RequestInit {
  isFormData?: boolean;
  // body can be an object for JSON, or FormData
  body?: any;
  skipAuth?: boolean; // Option to skip sending Authorization header
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = `${apiBaseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const headers: HeadersInit = {
    ...options.headers,
  };

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  
  if (!options.skipAuth) {
    const accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const method = options.method || 'GET';
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      // Note: CSRF token might not be needed for all JWT setups if APIs are stateless
      // and sessions aren't used. Check your Django JWT configuration.
      headers['X-CSRFToken'] = csrfToken;
    }
  }
  
  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && !options.isFormData) {
    config.body = JSON.stringify(options.body);
  } else if (options.body && options.isFormData) {
    config.body = options.body; // FormData is passed directly
  }


  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      errorData = await response.json();
      // Prefer a specific 'detail' or 'message' key from Django REST Framework errors
      errorMessage = errorData.detail || errorData.message || (typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
    } catch (e) {
      // If response is not JSON, use statusText or a generic message
      errorMessage = response.statusText || errorMessage;
    }
    console.error('API Error:', response.status, errorMessage, errorData);
    throw new Error(errorMessage);
  }

  if (response.status === 204) { // No Content
    return null as T;
  }

  return response.json();
}

export default apiClient;

