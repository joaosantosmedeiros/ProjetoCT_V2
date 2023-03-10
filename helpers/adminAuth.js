module.exports.checkAdminAuth = function(req, res, next){
    if(!req.session.adminid){
        res.redirect('/login')
    }

    next()
}