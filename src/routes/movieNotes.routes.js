const { Router } = require('express')

const MovieNotesController = require('../controllers/MovieNotesController')

const movieNotesRoutes = Router()

const movieNotesController =  new MovieNotesController()

movieNotesRoutes.get('/', movieNotesController.index)
movieNotesRoutes.post('/:user_id', movieNotesController.create)
movieNotesRoutes.get('/:id', movieNotesController.show)

module.exports = movieNotesRoutes