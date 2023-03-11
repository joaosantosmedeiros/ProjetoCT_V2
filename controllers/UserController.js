const { Op } = require('sequelize')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class UserController {

    static async list(req, res) {

        let query = ''

        if (req.query.email) {
            query = req.query.email
        }
        console.log(query)

        const usersRaw = await User.findAll({
            where: {
                email: { [Op.like]: `%${query}%` }
            },
            order: [
                ['type', 'DESC'],
                ['id', 'ASC']
            ]
        })

        const users = usersRaw.map(e => e.dataValues)

        for (const user of users) {
            user.active = user.active == false ? 'Não' : 'Sim'
        }

        return res.render('users/show', { users })
    }

    static async settings(req, res) {
        if (req.session.userid) {
            const id = req.session.userid

            const user = await User.findByPk(id, { raw: true })
            if (!user) {
                req.session.destroy()
                return res.redirect('/login')
            }

            return res.render('users/settings', { user })

        } else if (req.session.adminid) {
            const id = req.session.adminid
            const user = await User.findByPk(id, { raw: true })
            if (!user) {
                req.session.destroy()
                return res.redirect('/login')
            }

            return res.render('users/settings', { user })

        } else {
            req.session.destroy()
            return res.redirect('/login')
        }
    }

    static async settingsPost(req, res) {

        const { name, email, cpf, id } = req.body
        let password = req.body.password
        let newPassword = req.body.newPassword

        // Verifica se todos os campos obrigatórios foram enviados
        if (!email || !password || !name || !cpf) {
            req.flash('message', 'Preencha todos os campos!')
            return res.render('users/settings')
        }

        const userInfo = { email, password, name, cpf, id }

        // Verifica se o usuário editado existe
        const user = await User.findByPk(id, { raw: true })
        if (!user) {
            req.session.destroy()
            return res.redirect('/login')
        }

        // Verifica se a senha atual está correta
        if (!bcrypt.compareSync(password, user.password)) {
            req.flash('message', 'Senha incorreta!')
            return res.render('users/settings', { user: userInfo })
        }

        // Verifica se o email ja está em uso por outra pessoa
        const userByEmail = await User.findOne({ where: { email }, raw: true })
        if (userByEmail.id != id) {
            req.flash('message', 'Email já está em uso!')
            return res.render('users/settings', { user: userInfo })
        }

        // Verifica se o CPF ja está em uso
        const userByCpf = await User.findOne({ where: { cpf }, raw: true })
        if (userByCpf.id != id) {
            req.flash('message', 'CPF ou CNPJ já está em uso!')
            return res.render('users/settings', { user: userInfo })
        }

        // Caso uma nova senha seja inserida, encrypta e salva
        password = newPassword ? newPassword : password

        const salt = bcrypt.genSaltSync()
        const encryptedPassword = bcrypt.hashSync(password, salt)

        const newUser = {
            email,
            cpf,
            name,
            password: encryptedPassword
        }

        try {
            await User.update(newUser, { where: { id } })

            req.flash('message', 'Dados atualizados com sucesso!')
            req.session.save(() => {
                return res.redirect('/dashboard')
            })

        } catch (err) {
            console.log(err)
        }

    }

    static async delete(req, res) {
        const userId = req.session.userid
        const id = Number(req.body.id)

        // Verifica se o id do usuario da sessao é o mesmo do id do usuario que sera deletado
        if (userId != id) {
            req.session.destroy()
            return res.redirect('/login')
        }

        // Verifica se o usuário existe
        const user = await User.findByPk(id)
        if (!user) {
            req.flash('message', 'Erro inesperado! Tente novamente')
            req.session.save(() => {
                return res.redirect('/dashboard')
            })
        }

        await User.update({ active: false }, { where: { id } })

        req.session.destroy()
        res.redirect('/')

    }
}