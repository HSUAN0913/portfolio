const Project = require('../models/Project')

const projectController = {
    // GET /api/projects
    getAll: async (req, res) => {
        try {
            const projects = await Project.getAll()
            res.json(projects)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '無法取得作品列表' })
        }
    },

    // GET /api/projects/:id
    getById: async (req, res) => {
        try {
            const project = await Project.getById(req.params.id)
            if (!project) return res.status(404).json({ error: '找不到該作品' })
            res.json(project)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '無法取得作品' })
        }
    },

    // POST /api/projects
    create: async (req, res) => {
        try {
            const project = await Project.create(req.body)
            res.status(201).json(project)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '新增作品失敗' })
        }
    },

    // PUT /api/projects/:id
    update: async (req, res) => {
        try {
            const project = await Project.update(req.params.id, req.body)
            if (!project) return res.status(404).json({ error: '找不到該作品' })
            res.json(project)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '更新作品失敗' })
        }
    },

    // DELETE /api/projects/:id
    delete: async (req, res) => {
        try {
            await Project.delete(req.params.id)
            res.json({ message: '已刪除' })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: '刪除作品失敗' })
        }
    }
}

module.exports = projectController
