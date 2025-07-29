//
// API utility functions for interacting with the task manager backend
//

const API_BASE_URL = "http://localhost:3001";

function getToken() {
  return localStorage.getItem("auth_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC_INTERFACE
export async function apiLogin(username, password) {
  /** Authenticate user and get token. */
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiRegister(username, password) {
  /** Register user and get token. */
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiGetProfile() {
  /** Get current user profile. */
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiGetTasks({ category, status, sort, search } = {}) {
  /** Get tasks list with optional filters. */
  const params = [];
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (status) params.push(`status=${encodeURIComponent(status)}`);
  if (sort) params.push(`sort=${encodeURIComponent(sort)}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  const query = params.length ? `?${params.join("&")}` : "";
  const response = await fetch(`${API_BASE_URL}/tasks${query}`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiCreateTask(data) {
  /** Create a new task. */
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiUpdateTask(taskId, data) {
  /** Update an existing task. */
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiDeleteTask(taskId) {
  /** Delete a task. */
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiGetCategories() {
  /** Get category list for current user. */
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiCreateCategory(data) {
  /** Create a new category. */
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

// PUBLIC_INTERFACE
export async function apiGetStats() {
  /** Fetch dashboard/task statistics for the current user. */
  const response = await fetch(`${API_BASE_URL}/stats`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch statistics");
  return response.json();
}
