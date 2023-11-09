const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const authConfig = require('../config/authConfig')

class TeachersSessionsControllers {
  async createLogon(req, res){
    const {username , password} = req.body
    console.log('entrou')
    const user = await knex('teachers').where({username}).first()
    
    if(!user)throw new AppError('Usuário ou senha inválidos', 401)
    
    const checkPassoword = await compare(password, user.password)
    
    if(!checkPassoword)throw new AppError('Usuário ou senha inválidos', 401)
    
    const {secret, expiresIn} = authConfig.jwt
    
    const token = sign({}, secret, {
      subject : String(user.id),
      expiresIn 
    })

    return res.status(201).json({user, token})
  }

}
module.exports = TeachersSessionsControllers