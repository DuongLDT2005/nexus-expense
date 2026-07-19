import Constants from 'expo-constants';

const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }
  return 'http://192.168.1.154:5000'; // Fallback IP
};

const BASE_URL = getBaseUrl();

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
  }

  return response.json() as Promise<T>;
}
