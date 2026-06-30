const API_URL =
  import.meta.env.VITE_API_URL ||
  " https://task-management-system-mini-project.onrender.com/api";

const buildHeaders = (token, hasBody) => {
  const headers = {};

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (path, options = {}) => {
  const { token, body, headers: customHeaders, ...restOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      ...buildHeaders(token, body !== undefined),
      ...customHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const authRequest = (path, options = {}) =>
  apiRequest(`/auth${path}`, options);

export const userRequest = (path, options = {}) =>
  apiRequest(`/users${path}`, options);

export const projectRequest = (path, options = {}) =>
  apiRequest(`/projects${path}`, options);

export const taskRequest = (path, options = {}) =>
  apiRequest(`/tasks${path}`, options);

export const reportRequest = (path, options = {}) =>
  apiRequest(`/reports${path}`, options);