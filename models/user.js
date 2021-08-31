const mongoose = require('mongoose');
const crypto = require('crypto');
const {v1: uuidv1 } = require('uuid')
userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true})

// Schema method

userSchema.methods = {
    encryptPassword: function (password){
        if(!password) return;
        try{
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        }
        catch (err){
            return '';
        }
    },
    authenticate: function(entered_password){
        return this.encryptPassword(entered_password) === this.hashed_password;
    }
}

// Virtual Field
userSchema.virtual('password').
set(function (password){
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password)
})
const User = mongoose.model('User', userSchema)

module.exports = User;