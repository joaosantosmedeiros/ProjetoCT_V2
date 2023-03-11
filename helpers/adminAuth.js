module.exports.checkAdminAuth = function(req, res, next){
    if(!req.session.adminid){
        return res.redirect('/login')
    }

    next()
}