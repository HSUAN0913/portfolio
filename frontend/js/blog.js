/**
 * blog.js — Controller 層（blog.html）
 * 協調 api.js（Model）與 ui.js（View），管理 blog 頁面邏輯
 */

async function loadArticles() {
    const grid = document.getElementById('post-grid')
    if (!grid) return

    try {
        const articles = await api.getArticles()

        // 清除靜態假資料（如果有的話）
        grid.innerHTML = ''

        if (articles.length === 0) {
            grid.innerHTML = '<p style="color:var(--hint); font-size:13px;">目前還沒有文章。</p>'
            return
        }

        articles.forEach(article => ui.renderArticleCard(article, grid))
    } catch (err) {
        ui.showError('無法載入文章列表')
    }
}

// 初始化
loadArticles()
