/**
 * api.js — Model 層
 * 統一管理所有對後端的 fetch 請求
 */

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '' // Vercel：前後端同網域，使用相對路徑

// 共用 fetch 包裝（統一錯誤處理）
async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`)
    return res.json()
}

const api = {
    // ── Projects ──
    getProjects: () =>
        apiFetch('/api/projects'),

    getProject: (id) =>
        apiFetch(`/api/projects/${id}`),

    createProject: (data) =>
        apiFetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    updateProject: (id, data) =>
        apiFetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    deleteProject: (id) =>
        apiFetch(`/api/projects/${id}`, { method: 'DELETE' }),

    // ── Articles ──
    getArticles: () =>
        apiFetch('/api/articles'),

    getArticle: (id) =>
        apiFetch(`/api/articles/${id}`),

    createArticle: (data) =>
        apiFetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    updateArticle: (id, data) =>
        apiFetch(`/api/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }),

    deleteArticle: (id) =>
        apiFetch(`/api/articles/${id}`, { method: 'DELETE' }),
}
