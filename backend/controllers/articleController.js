const Article = require('../models/Article')

const articleController = {
    // GET /api/articles
    getAll: async (req, res) => {
        try {
            const articles = await Article.getAll()
            res.json(articles)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '無法取得文章列表' })
        }
    },

    // GET /api/articles/:id
    getById: async (req, res) => {
        try {
            const article = await Article.getById(req.params.id)
            if (!article) return res.status(404).json({ error: '找不到該文章' })
            res.json(article)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '無法取得文章' })
        }
    },

    // POST /api/articles
    create: async (req, res) => {
        try {
            const article = await Article.create(req.body)
            res.status(201).json(article)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '新增文章失敗' })
        }
    },

    // PUT /api/articles/:id
    update: async (req, res) => {
        try {
            const article = await Article.update(req.params.id, req.body)
            if (!article) return res.status(404).json({ error: '找不到該文章' })
            res.json(article)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '更新文章失敗' })
        }
    },

    // DELETE /api/articles/:id
    delete: async (req, res) => {
        try {
            await Article.delete(req.params.id)
            res.json({ message: '已刪除' })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '刪除文章失敗' })
        }
    }
}

module.exports = articleController
