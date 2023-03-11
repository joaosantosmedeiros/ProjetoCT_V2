module.exports.checkUser = function (req, res, next) {
    if (!req.session.userid) {
        return res.redirect('/login')
    }

    next()
}