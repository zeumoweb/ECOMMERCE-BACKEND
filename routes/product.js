const { requiredLogin, isAdmin, isAuth } = require("../controllers/auth");
const router = require("express").Router();
const { userById } = require("../controllers/user");
const { create, productById, remove, update, read, list, listRelated, listCategories, listBySearch, photo } = require("../controllers/product");

router.post("/product/create/:userId", requiredLogin, isAuth, isAdmin, create);

router.get("/product/:productId", read);
router.delete("/product/:productId/:userId", requiredLogin, isAuth, isAdmin, remove);

router.put("/product/:productId/:userId", requiredLogin, isAuth, isAdmin, update);

router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get('/products', list);
router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
