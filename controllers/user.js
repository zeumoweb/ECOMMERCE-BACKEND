const User = require("../models/user")
exports.userById = (req, res, next, id) => {
    User
        .findOne({ _id: id })
        .exec((error, user) => {
            if (error || !user) {
                return res.status(404).json({ error: "User not found" })
            }
            req.profile = user;
            next();
        })
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)
}

exports.update = (req, res) => {
    User.findOneAndUpdate({_id: req.profile._id }, {$set: req.body}, {new: true}, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: "You don't have the neccessary permission" })
        }
        return res.json({message: "User successfully updated", user})

    })
}