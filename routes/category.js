const router = require('express').Router();
const { isAuth, isAdmin, requiredLogin } = require('../controllers/auth');
const { create, categoryById, update, remove, list } = require('../controllers/category');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', requiredLogin, isAuth, isAdmin, create);

router.put('/category/:categoryId/:userId', requiredLogin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:userId', requiredLogin, isAuth, isAdmin, remove)

router.get('/categories', list)
router.param('userId', userById);
router.param('categoryId', categoryById);
module.exports = router;