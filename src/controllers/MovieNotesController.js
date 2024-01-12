const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieNotesController {
  async index(request, response) {
    const { user_id, title, movie_tags } = request.query

    let movie_notes;

    if (movie_tags) {
      const filteredMovieTags = movie_tags
        .split(',')
        .map((movie_tag) => movie_tag.trim());

      movie_notes = await knex('movie_tags')
        .select([
          'movie_notes.id',
          'movie_notes.title',
          'movie_notes.description',
          'movie_notes.rating',
          'movie_notes.user_id',
        ])
        .where('movie_notes.user_id', user_id)
        .whereLike('movie_notes.title', `%${title}%`)
        .whereIn('name', filteredMovieTags)
        .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.movie_note_id')
        .orderBy('movie_notes.title');
    } else {
      movie_notes = await knex('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title');
    }

    const userMovieTags = await knex('movie_tags').where({ user_id });
    const notesWithMovieTags = movie_notes.map((movie_note) => {
      const movieNoteTags = userMovieTags.filter(
        (tag) => tag.movie_note_id === movie_note.id
      );

      return {
        ...movie_note,
        movie_tags: movieNoteTags,
      };
    });

    return response.json(notesWithMovieTags);
  }

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