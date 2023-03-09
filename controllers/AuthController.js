const User = require('../models/User')
const bcrypt = require('bcryptjs')

const { Op } = require('sequelize');


module.exports = class AuthController {

    static home(req, res) {
        res.render('auth/home')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, cpf, email, password, confirmpassword } = req.body

        // Verifica se todos os dados forem inseridos
        if (!name || !cpf || !email || !password || !confirmpassword) {
            req.flash('message', 'Preencha todos os campos!')
            res.render('auth/register')
        }

        // Verifica se as senhas inseridas conferem
        if (password !== confirmpassword) {
            req.flash('message', 'As senhas não conferem!')
            res.render('auth/register')
        }

        // Verifica se algum usuário ja foi cadastrado pelo email ou cpf/cnpj
        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    {cpf: cpf},
                    {email: email}
                ]
            }
        })

        if(userExists){
            req.flash('message', 'Usuário já cadastrado!')
            res.render('auth/register')
        }

        const salt = bcrypt.genSaltSync()
        const encryptedPassword = bcrypt.hashSync(password, salt)

        try{
            const user = await User.create({
                name,
                email,
                password: encryptedPassword,
                cpf
            })

            console.log(user)
            req.session.userid = user.id

            req.flash('message', 'Usuário cadastrado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
                return
            })

        }catch(err){
            console.log(err)
            req.flash('message', 'Erro inesperado!')
            res.render('auth/register')
        }
    }

}