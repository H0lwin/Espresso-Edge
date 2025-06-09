
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
  body?: any;
  skipAuth?: boolean;
  isRetry?: boolean; // To prevent infinite refresh loops
}

// Define a function type for refreshing the token, to be provided by AuthContext
type RefreshTokenFunction = () => Promise<string | null>;
let refreshTokenFunction: RefreshTokenFunction | null = null;

export function setRefreshTokenFunction(fn: RefreshTokenFunction) {
  refreshTokenFunction = fn;
}


async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const IS_SERVER = typeof window === 'undefined';
  let resolvedApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (IS_SERVER && !resolvedApiBaseUrl) {
    // Default for server-side calls (e.g., Server Components) during local development
    resolvedApiBaseUrl = 'http://127.0.0.1:8000'; // Common local Django dev port
    console.warn(
      `NEXT_PUBLIC_API_BASE_URL is not set for a server-side call. Defaulting to ${resolvedApiBaseUrl}. Ensure this is configured for production.`
    );
  } else if (!resolvedApiBaseUrl) {
    // For client-side calls, if not set, paths will be relative to the current origin.
    resolvedApiBaseUrl = '';
  }

  // Ensure endpoint starts with a slash if apiBaseUrl is present, or is relative if not.
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${resolvedApiBaseUrl}${path}`;

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
    config.body = options.body;
  }

  let response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401 && !options.skipAuth && !options.isRetry && refreshTokenFunction) {
      try {
        const newAccessToken = await refreshTokenFunction();
        if (newAccessToken) {
          // Update header with new token
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
          // Retry the original request
          response = await fetch(url, { ...config, isRetry: true } as RequestOptions); // Cast to ensure isRetry is part of type
          if (response.ok) {
            if (response.status === 204) return null as T;
            return response.json();
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed, user will be logged out:", refreshError);
        // If refresh fails, proceed to throw the original error or a specific refresh error
        // AuthContext should handle actual logout if refresh fails globally
      }
    }

    // If still not ok (or refresh didn't happen/succeed), process the error
    let errorData;
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || (errorData.non_field_errors ? errorData.non_field_errors.join(', ') : null) || (typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
    } catch (e) {
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
