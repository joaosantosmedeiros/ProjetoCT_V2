const { Op } = require('sequelize')
const User = require('../models/User')

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

        return res.render('users/show', { users })
    }

}