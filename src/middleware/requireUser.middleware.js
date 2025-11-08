// src/middleware/requireUser.middleware.js

function requireUser(req, res, next) {
    try {
        var user = null;
        if (req && req.user) user = req.user;
        else if (req && req.session && req.session.user) user = req.session.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: authentication required' });
        }

        req.currentUser = user;
        return next();
    } catch (err) {
        console.error('requireUser error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = requireUser;