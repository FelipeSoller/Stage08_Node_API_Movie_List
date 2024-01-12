const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, movie_tags } = request.body
    const { user_id } = request.params

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5')
    }

    const [movie_note_id] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id
    })

    const movieTagsInsert = movie_tags.map(name => {
      return {
        movie_note_id,
        user_id,
        name
      }
    })

    await knex('movie_tags').insert(movieTagsInsert)

    response.json()
  }
}

module.exports = MovieNotesController