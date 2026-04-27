/**
 * ui.js — View 層
 * 負責所有 DOM 操作，不包含任何資料取得邏輯
 */

const ui = {
    // ── Portfolio 作品卡 ──
    renderProject: (project, index) => {
        const titleEl = document.getElementById(`proj-title-${index}`)
        const descEl  = document.getElementById(`proj-desc-${index}`)
        const imgEl   = document.getElementById(`proj-img-${index}`)
        const linkEl  = document.getElementById(`proj-link-${index}`)

        if (!titleEl) return // 超過版面可顯示數量時跳過
        titleEl.textContent = project.title
        descEl.textContent  = project.description
        imgEl.src           = project.image_url
        imgEl.alt           = project.title
        linkEl.href         = project.demo_url || '#'
    },

    // ── Blog 文章卡 ──
    renderArticleCard: (article, container) => {
        const card = document.createElement('a')
        card.className = 'post-card'
        card.href = `article.html?id=${article.id}`

        // 摘要：content 前 80 字
        const excerpt = article.content
            ? article.content.slice(0, 80) + '…'
            : ''

        card.innerHTML = `
            <div class="post-cover-wrap">
                <img src="${article.cover_image || ''}" alt="${article.title}" loading="lazy">
            </div>
            <div class="post-body">
                <div class="post-title">${article.title}</div>
                <div class="post-date">${new Date(article.created_at).toLocaleDateString('zh-TW')}</div>
                <div class="post-excerpt">${excerpt}</div>
            </div>
        `
        container.appendChild(card)
    },

    // ── 錯誤提示 ──
    showError: (message) => {
        console.error(message)
        // 可以在這裡擴充成畫面上的 toast 提示
    }
}
