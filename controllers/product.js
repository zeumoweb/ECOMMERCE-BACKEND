const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { request } = require("express");

exports.create = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Could not upload image" });
        }
        // checking for the presence of all fields
        const { name, shipping, price, description, quantity, category } = fields;
        if (
            !name ||
            !shipping ||
            !price ||
            !category ||
            !description ||
            !quantity
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const product = new Product(fields);
        if (files.photo) {
            // checking for file size
            if (files.photo.size > 2000000) {
                return res
                    .status(400)
                    .json({ error: "Image size should not exceed 2Mb" });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
            product.save((err, product) => {
                if (err) return res.status(400).json({ error: errorHandler(err) });
                res.status(200).json({ product });
            });
        }
    });
};

exports.productById = (req, res, next, id) => {
    Product.findOne({ _id: id }).exec((err, product) => {
        if (err || !product)
            return res.status(400).json({ error: "No product found" });
        req.product = product;
        next();
    });
};

exports.remove = (req, res) => {
    const id = req.product._id;
    Product.deleteOne({ _id: id }, (err) => {
        if(err) return res.status(400).json({error: "Could not delete product"});
        return res.status(200).json({ message: "Product succesfully deleted"});
    })
}


exports.update = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Could not upload image" });
        }
        // checking for the presence of all fields
        const { name, shipping, price, description, quantity, category } = fields;
        if (
            !name ||
            !shipping ||
            !price ||
            !category ||
            !description ||
            !quantity
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        let product = req.product;
        product = _.extend(product, fields);
        if (files.photo) {
            // checking for file size
            if (files.photo.size > 2000000) {
                return res
                    .status(400)
                    .json({ error: "Image size should not exceed 2Mb" });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, product) => {
            if (err) return res.status(400).json({ error: errorHandler(err) });
            res.status(200).json({ product, message: "Successfully updated" });
        });
    });
};

exports.read = (req, res) => {
        req.product.photo = undefined;
        res.json(req.product);
}

/** It will find and display the products based on the query Parameters
and will display all product if no query parameter is available*/
exports.list = (req, res ) => {
    const sortBy = req.query.sortby ? req.query.sortBy : "_id";
    const order = req.query.order ? req.query.order : "asc";
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    Product
        .find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec( (err, data) => {
            if(err || !data) return res.status(400).json({error: "Product not found"});
            return res.status(200).json({data})
        })
}

/** it will find and display the products related to the current product based on the current req product category */

exports.listRelated = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 8;
    Product
        .find({_id: {$ne: req.product}, category: req.product.category})
        .populate("category", "_id name")
        .limit(limit)
        .exec((err, data) => {
            if (err || !data) return res.status(400).json({ error: "Product not found" });
            return res.status(200).json({ data })
        })     
}

exports.listCategories = (req, res) => {
    Product
    .distinct("category", null, (err, categories) => {
        if (err || !categories) return res.status(400).json({ error: "Category not found" });
        return res.status(200).json( categories )
    })
}

exports.listBySearch = ( req, res ) => {
    const limit = req.body.limit ? parseInt(req.body.limit) : 100; 
    const sortBy = req.body.sortBy ? req.body.sortBy : "_id"; 
    const order = req.body.order ? req.body.order : "desc";
    const skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        res.send(req.product.photo.data)
    }
    next()
}
