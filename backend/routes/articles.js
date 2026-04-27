const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articleController')

router.get('/',     articleController.getAll)
router.get('/:id',  articleController.getById)
router.post('/',    articleController.create)
router.put('/:id',  articleController.update)
router.delete('/:id', articleController.delete)

module.exports = router
