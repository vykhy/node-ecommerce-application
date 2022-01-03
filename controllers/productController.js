const Product = require('../models/Product')
const Category = require('../models/Category')

exports.getProduct = async ( req, res ) => {
    res.send(req.params.id)
}

exports.getAllProducts = async ( req, res ) => {
    
}

exports.getCategoryProducts = async ( req, res ) => {
    
}

exports.getChooseCategory = async ( req, res ) => {
    try{
        const categories = await Category.find()
        if(!categories){
            res.render('categories/create', { message: 'No category exists. Create one now.'})
            return
        }
        res.render('products/chooseCat', { categories })
    }
    catch(error){
        res.send(error.message)
    }
}

exports.chooseCategory = async ( req, res ) => {
    const name = req.body.category
    try{
        const category = await Category.findOne({ name: name })

        if(!category){
            res.send('Oops. There was an error.')
            return
        }
        res.render('products/create', { category })
    }
    catch(error){
        res.send(error.message)
    }
}

exports.createProduct = async ( req, res ) => {
    const { name, description, longDescription, price, sellingPrice, ...data } = req.body
    const catId = req.params.catId

    try{
        const product = await Product.create({
            _id: name, description, longDescription, price, sellingPrice,
            category: catId,
            details: data,
            creator: req.session.uid
        })
        if(product){
            res.redirect(`/products/${product._id}`)
            console.log(product)
            return
        }
        res.send('Failed to create product')
    }
    catch(error){
        res.send(error.message)
    }
}

exports.getUpdateProduct = async ( req, res ) => {
    
}

exports.updateProduct = async ( req, res ) => {
    
}

exports.getDeleteProduct = async ( req, res ) => {
    
}

exports.deleteProduct = async ( req, res ) => {
    
}