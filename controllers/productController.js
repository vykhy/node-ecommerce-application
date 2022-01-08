const Product = require('../models/Product')
const Category = require('../models/Category')
const anyIsEmpty = require('../services/functions').anyIsEmpty

function extractProductDetails(product){
    return Object.entries(product.details)
}

exports.getProduct = async ( req, res ) => {
    const id = req.params.id

    try{
        const product = await Product.findById(id)

        if(!product){
            res.send('Oops. Product was not found')
            return
        }
        const details = extractProductDetails(product)
        res.render('products/product', { product, details })
    }
    catch(error){
        res.send(error.message)
    }
}

exports.getAllProducts = async ( req, res ) => {
    try{
        const products = await Product.find()

        if(!products){
            res.send('No product was found')
            return
        }
        res.render('products/products', { products })
    }
    catch(error){
        res.send(error.message)
    }
}

exports.getCategoryProducts = async ( req, res ) => {
    const catId = req.params.catId

    try{
        const products = await Product.find({ category: catId })
        if(products.length < 1){
            res.send('No product was found')
            return
        }
        res.render('products/products', { products })
    }
    catch(error){
        res.send(error.message)
    }
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
            name, description, longDescription, price, sellingPrice,
            category: catId,
            details: data,
            creator: req.session.uid
        })
        if(product){
            res.redirect(`/products/${product._id}`)
            return
        }
        res.send('Failed to create product')
    }
    catch(error){
        res.render('products/create', {
            name, description, longDescription, price, sellingPrice, error: error.message
        })
    }
}

exports.getUpdateProduct = async ( req, res ) => {
    const id = req.params.id
    try{
        const product = await Product.findOne({ _id: id })
        if(!product){
            res.send('Product not found')
            }
        const details = extractProductDetails(product)
        res.render('products/edit', { product, details })
    }
    catch(error){
        res.send(error.message)
    }
}

exports.updateProduct = async ( req, res ) => {
    const id = req.params.id

    const { name, description, longDescription, price, sellingPrice, ...details } = req.body

    try{
        const product = await Product.findOne({ _id: id })

        //if product doesnt exist. Happens only when page is tampered with.
        if(!product){
            const product = { _id: id, name, description, longDescription, price, sellingPrice }
            res.render('products/edit', { 
                product,
                error: 'Failed to update.Dont mess with the URL. It helps no one.',
                details: Object.entries(details)
            })
            return
        }

        //check if some fields are empty. Arguments take all the variables whose value should be checked for being empty.
        if(anyIsEmpty([name, description, longDescription, price, sellingPrice])){
            const product = { _id: id, name, description, longDescription, price, sellingPrice }
            res.render('products/edit', { 
                product,
                error: 'Please fill the required fields',
                details: Object.entries(details)
            })
            return
        }

        //only products you added can be modified
        if( product.creator != req.session.uid ) {
            res.send('Unauthorized. You can only edit products created by you')
            return
        }

        const success = await product.update({
            name, description, longDescription, price, sellingPrice, details
        })
        if( success.acknowledged ){
            res.redirect(`/products/${id}`)
        }
    }
    catch(error){
        res.render('errors/error', { error })
    }
}

exports.getDeleteProduct = async ( req, res ) => {
    const id = req.params.id
    try{
        let product = await Product.findOne({ _id: id })
        if(!product){
            res.send('Product not found'); 
            return
        }
        const details = extractProductDetails( product )
        res.render('products/delete', { product, details })
    }
    catch(error){
        res.send(error.message)
    }
}

exports.deleteProduct = async ( req, res ) => {
    const id = req.params.id

    try{
        const success = await Product.deleteOne({ _id: id })
        if(success.deletedCount > 0){
            res.send('Deleted successfully')
        }
        res.send('Failed to delete')
    }
    catch(error){
        res.send(error.message)
    }
}