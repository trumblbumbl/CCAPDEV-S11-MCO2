exports.requireLogin = (req, res, next) => {
    if (!req.session.user) return res.redirect("/login");
    next();
};

exports.requireRole = (...roles) => (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.userType)) {
        return res.status(403).send("Access denied.");
    }
    next();
};