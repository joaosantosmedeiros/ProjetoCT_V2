module.exports.checkAnyAuth = function(req, res, next){
    if(!req.session.auth){
        res.redirect('/')
    }

    next()
}