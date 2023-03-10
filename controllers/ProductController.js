const { Op } = require('sequelize')
const Product = require('../models/Product')

module.exports = class ProductController {

    static create(req, res) {
        return res.render('products/create')
    }

    static async createPost(req, res) {
        const { name, unity } = req.body
        const price = Number(req.body.price)

        // Verifica se todos os campos foram preenchidos
        if (!name || !price || !unity) {
            req.flash('message', 'Preencha todos os campos!')

            return res.render('products/create')
        }

        // Verifica se o valor inserido do preço é um número
        if (typeof price != 'number') {
            req.flash('message', 'Preço deve ser numérico!')

            return res.render('products/create')
        }

        try {
            await Product.create({
                name: name,
                price: price,
                unity: unity
            })

            req.flash('message', 'Produto cadastrado com sucesso!')
            req.session.save(() => {
                return res.redirect('/dashboard')
            })

        } catch (error) {
            console.log(error)
            req.flash('message', 'Ocorreu um erro inesperado! Tente novamente.')

            return res.render('products/create')
        }
    }

    static async show(req, res) {

        let query = ''

        if (req.query.name) {
            query = req.query.name
        }

        const productsRaw = await Product.findAll({
            where: {
                name: { [Op.like]: `%${query}%` }
            }
        })

        const products = productsRaw.map(e => e.dataValues)

        return res.render('products/show', { products })
    }

    static async showOne(req, res) {
        const id = req.params.id

        const product = await Product.findByPk(id, { raw: true })
        if (!product) {
            return res.redirect('/404')
        }

        return res.render('products/showOne', { product })
    }

    static async delete(req, res) {
        const id = Number(req.body.id)

        const product = await Product.findByPk(id)
        if (!product) {
            return res.redirect('/404')
        }

        await product.destroy()

        req.flash('message', 'Produto deletado com sucesso!')
        req.session.save(() => {
            return res.redirect('/dashboard')
        })
    }

    static async edit(req, res) {
        const id = Number(req.params.id)

        const product = await Product.findByPk(id, { raw: true })
        if (!product) {
            return res.redirect('/404')
        }

        return res.render('products/edit', { product })
    }

    static async editPost(req, res) {
        const id = req.body.id
        const { name, unity } = req.body
        const price = Number(req.body.price)

        // Verifica se todos os campos foram preenchidos
        if (!name || !price || !unity) {
            req.flash('message', 'Preencha todos os campos!')

            return res.render('products/create')
        }

        const product = { name, price, unity }

        try {
            await Product.update(product, { where: { id } })

            req.flash('message', 'Produto atualizado com sucesso!')
            req.session.save(() => {
                return res.redirect('/dashboard')
            })

        } catch (err) {
            console.log(err)
            req.flash('message', 'Ocorreu um erro inesperado! Tente novamente.')

            req.session.save(() => {
                return res.redirect('/dashboard')
            })
        }
    }
}