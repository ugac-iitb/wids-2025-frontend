/**
 * API utility functions for making authenticated requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://understandably-subquadrangular-keven.ngrok-free.dev";

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

/**
 * Make an authenticated API request
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add ngrok-skip-browser-warning header if using ngrok (optional, uncomment if needed)
  // if (API_BASE_URL.includes("ngrok")) {
  //   headers["ngrok-skip-browser-warning"] = "true";
  // }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
    mode: "cors",
    credentials: "include",
  });
};

/**
 * Check if the current user is a mentor by calling the mentor projects endpoint
 */
export const checkIsMentor = async (): Promise<boolean> => {
  try {
    const response = await apiRequest("/api/mentor/projects");
    
    // If we get 403 with mentor_only error, user is not a mentor
    if (response.status === 403) {
      const data = await response.json();
      if (data.error === "mentor_only") {
        return false;
      }
    }
    
    // If we get a successful response (200), user is a mentor
    if (response.ok) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking mentor status:", error);
    return false;
  }
};

