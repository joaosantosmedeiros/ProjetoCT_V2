module.exports.checkAnyAuth = function(req, res, next){
    if(!req.session.auth){
        return res.redirect('/login')
    }

    next()
}