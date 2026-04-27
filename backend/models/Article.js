const pool = require('../db')

const Article = {
    getAll: async () => {
        const result = await pool.query(
            'SELECT * FROM articles ORDER BY created_at DESC'
        )
        return result.rows
    },

    getById: async (id) => {
        const result = await pool.query(
            'SELECT * FROM articles WHERE id = $1', [id]
        )
        return result.rows[0]
    },

    create: async ({ title, content, cover_image }) => {
        const result = await pool.query(
            'INSERT INTO articles (title, content, cover_image) VALUES ($1,$2,$3) RETURNING *',
            [title, content, cover_image]
        )
        return result.rows[0]
    },

    update: async (id, { title, content, cover_image }) => {
        const result = await pool.query(
            'UPDATE articles SET title=$1, content=$2, cover_image=$3 WHERE id=$4 RETURNING *',
            [title, content, cover_image, id]
        )
        return result.rows[0]
    },

    delete: async (id) => {
        await pool.query('DELETE FROM articles WHERE id = $1', [id])
    }
}

module.exports = Article
