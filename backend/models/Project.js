const pool = require('../db')

const Project = {
    getAll: async () => {
        const result = await pool.query(
            'SELECT * FROM projects ORDER BY created_at DESC'
        )
        return result.rows
    },

    getById: async (id) => {
        const result = await pool.query(
            'SELECT * FROM projects WHERE id = $1', [id]
        )
        return result.rows[0]
    },

    create: async ({ title, description, image_url, demo_url, github_url }) => {
        const result = await pool.query(
            'INSERT INTO projects (title, description, image_url, demo_url, github_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [title, description, image_url, demo_url, github_url]
        )
        return result.rows[0]
    },

    update: async (id, { title, description, image_url, demo_url, github_url }) => {
        const result = await pool.query(
            'UPDATE projects SET title=$1, description=$2, image_url=$3, demo_url=$4, github_url=$5 WHERE id=$6 RETURNING *',
            [title, description, image_url, demo_url, github_url, id]
        )
        return result.rows[0]
    },

    delete: async (id) => {
        await pool.query('DELETE FROM projects WHERE id = $1', [id])
    }
}

module.exports = Project
