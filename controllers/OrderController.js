const Product = require('../models/Product')
const User = require('../models/User')
const Order = require('../models/Order')
const { Op } = require('sequelize')

module.exports = class OrderController {

    static async list(req, res) {

        let search = req.query.id ? req.query.id : ''

        const ordersRaw = await Order.findAll({
            where: { id: { [Op.like]: `%${search}%` } }
        })
        const orders = ordersRaw.map(e => e.dataValues)

        for (const order of orders) {
            order.approved = order.approved == false ? 'Não' : 'Sim'

            if (order.approved == 'Não') {
                order.disapproved = true
            }
        }

        return res.render('orders/show', { orders })
    }

    static async listOne(req, res) {
        const id = req.params.id

        const order = await Order.findByPk(id, { raw: true })
        if (!order) {
            return res.redirect('/404')
        }

        if (order.approved == 0) {
            order.disapproved = true
            order.approved = 'Não'
        }

        return res.render('orders/showOne', { order })
    }

    static async createOrder(req, res) {

        const productsRaw = await Product.findAll()
        const products = productsRaw.map(e => e.dataValues)
        const productsNames = products.map(e => e.name)

        return res.render('orders/create', { productsNames })
    }

    static async createOrderPost(req, res) {

        const { name, quantity } = req.body
        const userId = req.session.userid

        // Verifica se o ID do usuário da sessão resulta em um usuario existente
        const user = await User.findByPk(userId)
        if (!user) {
            req.session.destroy()
            return res.redirect('/')
        }

        // Verifica se o usuário é admin
        if (user.type == 'admin') {
            req.flash('message', 'Admins não podem realizar pedidos!')
            return res.render('orders/create')
        }

        // Verifica se todas os campos foram preenchidos
        if (!name || !quantity) {
            req.flash('message', 'Preencha todos os campos!')
            return res.render('orders/create')
        }

        // Verifica se o produto existe
        const product = await Product.findOne({ where: { name }, raw: true })
        if (!product) {
            req.flash('message', 'Insira um produto existente!!')
            return res.render('orders/create')
        }

        const order = {
            quantity: quantity,
            UserId: userId,
            productName: product.name,
            totalPrice: (quantity * product.price)
        }

        return res.render('orders/confirmOrder', { order })
    }

    static async confirm(req, res) {

        const { productName } = req.body
        const quantity = Number(req.body.quantity)
        const totalPrice = Number(req.body.totalPrice)
        const UserId = Number(req.body.UserId)

        const order = { productName, quantity, totalPrice, UserId }

        try {
            await Order.create(order)

            req.flash('message', 'Pedido realizado com sucesso!')

            req.session.save(() => {
                return res.redirect('/dashboard')
            })

        } catch (err) {
            console.log(err)

            req.flash('message', 'Ocorreu um erro inesperado! Tente novamente.')

            req.session.save(() => {
                return res.redirect('/order/create')
            })
        }
    }

    static async myOrders(req, res) {
        const userId = req.session.userid

        const user = await User.findByPk(userId, { raw: true })
        if (!user) {
            req.session.destroy()
            return res.redirect('/login')
        }

        const ordersRaw = await Order.findAll({ where: { UserId: userId } })
        const orders = ordersRaw.map(e => e.dataValues)

        for (const order of orders) {
            order.approved = order.approved == false ? 'Não' : 'Sim'
            if (order.approved == 'Não') {
                order.deletable = true
            }
        }

        return res.render('orders/myOrders', { orders })
    }

    static async deleteOrder(req, res) {
        const userId = req.session.userid
        const id = Number(req.body.id)

        const user = await User.findByPk(userId, { raw: true })
        if (!user) {
            req.session.destroy()
            return res.redirect('/')
        }

        const order = await Order.findByPk(id, { raw: true })
        if (!order) {
            return res.redirect('/404')
        }

        if (order.UserId != user.id) {

            req.flash('message', 'Não é possivel deletar o pedido de outro usuário!')
            req.session.save(() => {
                return res.redirect('/dashboard')
            })
        }

        await Order.destroy({ where: { id: order.id } })

        req.flash('message', 'Pedido deletado com sucesso!')
        req.session.save(() => {
            return res.redirect('/dashboard')
        })
    }

    static async approve(req, res) {
        const id = Number(req.body.id)
       
        const order = await Order.findByPk(id, { raw: true })
        if (!order) {
            return res.redirect('/404')
        }

        await Order.update({ approved: true }, { where: { id: id } })

        req.flash('message', 'Pedido aprovado com sucesso!')
        req.session.save(() => {
            return res.redirect('/dashboard')
        })
    }
}