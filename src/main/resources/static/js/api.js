(() => {
  const base = window.APP_CONFIG.API_BASE_URL.replace(/\/$/, "");
  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`${base}${path}`, {
        ...options, signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) }
      });
      const raw = await response.text();
      let data = raw;
      try { data = raw ? JSON.parse(raw) : null; } catch (_) {}
      if (!response.ok) {
        const message = typeof data === "string" ? data : (data?.message || data?.error || `Request failed (${response.status})`);
        const error = new Error(message); error.status = response.status; throw error;
      }
      return data;
    } finally { clearTimeout(timeout); }
  }
  window.API = {
    base,
    getEmployees: () => request("/emp"),
    getEmployee: id => request(`/emp/${encodeURIComponent(id)}`),
    createEmployee: payload => request("/emp", { method: "POST", body: JSON.stringify(payload) }),
    updateEmployee: (id, payload) => request(`/emp/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }),
    deleteEmployee: id => request(`/emp/${encodeURIComponent(id)}`, { method: "DELETE" }),
    getDepartments: () => request("/departments"),
    createDepartment: name => request("/departments", { method: "POST", body: JSON.stringify({ name }) }),
    updateDepartment: (id, name) => request(`/departments/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify({ name }) }),
    deleteDepartment: id => request(`/departments/${encodeURIComponent(id)}`, { method: "DELETE" }),
    check: async () => { await Promise.all([request("/emp"), request("/departments")]); return true; }
  };
})();