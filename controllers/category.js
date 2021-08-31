const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');
exports.create = (req, res ) => {
    const category = new Category(req.body);
    category.save( (err, data ) => {
        if(err) return res.status(400).json({ error: errorHandler(err) });
        return res.status(200).json({ data });
    });
}

exports.categoryById = (req, res, next, id) => {
    Category
        .findOne({ _id: id})
        .exec( (err, category) => {
            if(err || !category) return res.status(400).json({ error: "No category found"});
            req.category = category;
            next();
        })
}

exports.remove = (req, res) => {
    const id = req.category._id
    Category
        .deleteOne({_id: id})
        .exec( err => {
            if(err) return res.status(400).json({ error: "Could not delete categdory"});
            return res.status(200).json({ message: "Successfully deleted category"})
        })
}

exports.update = (req, res) => {
    let category = req.category; 
    category.name = req.body.name;

    category.save((err, data) => {
        if(err) return res.status(200).json({ error: 'Could not update category'});
        return res.status(200).json({ message: "Successfully update category", data})
    })
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) return res.status(400).json({ error: errorHandler(err), good:"good" });
        return res.status(200).json({ data })
    })
}