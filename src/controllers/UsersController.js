const knex = require('../database/knex')
const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const checkUserExists = await knex('users').where('email', email).first()

    if (checkUserExists) {
      throw new AppError('This email is already in use')
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, new_password } = request.body
    const { id } = request.params

    const user = await knex('users').where('id', id).first()

    if (!user) {
      throw new AppError('User not found')
    }

    const userWithUpdatedEmail = await knex('users').where('email', email).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Email already in use')
    }

    const updatedUser = { ...user }

    updatedUser.name = name ?? user.name
    updatedUser.email = email ?? user.email

    if (new_password && !password) {
      throw new AppError('You need to enter your current password to change your password')
    }

    if (new_password && password) {
      const checkPassword = await compare(password, user.password)

      if (!checkPassword) {
        throw new AppError('Your current password is wrong')
      }

      updatedUser.password = await hash(new_password, 8)
    }

    await knex('users')
      .where('id', id)
      .update({
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        updated_at: knex.fn.now()
      })

    return response.status(200).json(updatedUser)
  }
}

module.exports = UsersController