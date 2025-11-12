import { getItem } from "../utils/storage";

// API Configuration
// Choose the appropriate URL based on your device:

// For Physical Device (iPhone/Android on same WiFi):
const API_URL = "http://192.168.3.2:3000/api"; // ✅ UPDATED IP!

// For iOS Simulator:
// const API_URL = "http://localhost:3000/api";

// For Android Emulator (special case):
// const API_URL = "http://10.0.2.2:3000/api";

// For Production:
// const API_URL = "https://your-api.com/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  // Get auth token if not provided
  const authToken = token || (await getItem("authToken"));

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Export API client
export const api = {
  get: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: "GET", token }),

  post: <T>(endpoint: string, body: any, token?: string) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      token,
    }),

  put: <T>(endpoint: string, body: any, token?: string) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: "DELETE", token }),
};

export default api;
