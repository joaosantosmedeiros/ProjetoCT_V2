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
            return
        }

        // Verifica se as senhas inseridas conferem
        if (password !== confirmpassword) {
            req.flash('message', 'As senhas não conferem!')
            res.render('auth/register')
            return
        }

        // Verifica se algum usuário ja foi cadastrado pelo email ou cpf/cnpj
        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { cpf: cpf },
                    { email: email }
                ]
            }
        })

        if (userExists) {
            req.flash('message', 'Usuário já cadastrado!')
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync()
        const encryptedPassword = bcrypt.hashSync(password, salt)

        try {
            const user = await User.create({
                name,
                email,
                password: encryptedPassword,
                cpf
            })

            req.session.userid = user.dataValues.id
            req.session.auth = true

            req.flash('message', 'Usuário cadastrado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
                return
            })

        } catch (err) {
            console.log(err)
            req.flash('message', 'Erro inesperado!')
            res.render('auth/register')
            return
        }
    }

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        // Verifica se todos os campos estão presentes
        if (!email || !password) {
            req.flash('message', 'Preencha todos os campos!')
            res.render('auth/login')
            return
        }

        // Verifica se usuário existe
        const user = await User.findOne({ where: { email: email }, raw: true })
        if (!user) {
            req.flash('message', 'Credenciais incorretas!')
            res.render('auth/login')
            return
        }

        // Verifica se o usuário possui conta ativa
        if(user.active == 0){
            req.flash('message', 'Conta inativa!')
            res.render('auth/login')
            return
        }

        // Verifica se as senhas conferem
        if (!bcrypt.compareSync(password, user.password)) {
            req.flash('message', 'Credenciais incorretas!')
            res.render('auth/login')
            return
        }

        if (user.type == 'user') {
            req.session.userid = user.id
        } else {
            req.session.adminid = user.id
        }

        req.session.auth = true

        req.flash('message', 'Autenticação realizada com sucesso.')

        req.session.save(() => {
            res.redirect('/')
        })
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/')
    }
}