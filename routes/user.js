const express = require('express'); 

const { requiredLogin, isAdmin, isAuth } = require('../controllers/auth');
const router = express.Router();
const { userById, update, read } = require('../controllers/user');
const { create } = require('../controllers/product');

router.get('/user/:userId', update)

router.param('userId', userById); 

module.exports = router