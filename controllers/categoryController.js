const Category = require('../models/Category')

/**
 * get a category
 */ 
exports.getOneCategory = async ( req, res ) => {
    const id = req.params.id
    try{
        const category = await Category.findOne({ _id: id})
        if(!category){
            res.send('Categor not found.')
        }
        res.render('categories/category', { category })
    }
    catch(error){ res.send(error.message) }
}
/**
 * create a category
 * @param {*} req 
 * @param {*} res 
 * @returns category
 */
exports.createCategory = async ( req, res ) => {
    const { name, description, attributes } = req.body
    const attributesArray = attributes.split('\r\n')

    try{
        const category = await Category.create({
            name,
            description,
            attributes: attributesArray
        })
        return category
    }
    catch(error){
        res.send(error.message)
        return false
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns pre-filled update form
 */
exports.getUpdateCategory = async ( req, res ) => {
    const id = req.params.id
    try{
        const category = await Category.findOne({ _id: id })
        //check whether it exists
        if(!category){
            res.send('Category not found'); return
        }
        //send prefilled form
        res.render('categories/update', {
            id: category._id,
            name: category.name,
            description: category.description,
            attributes: category.attributes.join('\n')
        })
    }
    catch(error){
        res.send(error.message)
    }
}

/**
 * update a category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateCategory = async ( req, res ) => {
    const { name, description, attributes } = req.body
    const { id } = req.params
    attributesArray = attributes.split('\n')

    try{
        const category = await Category.findById(id)

        //check whether it exists
        if(!category){
            res.send('Could not find category')
            return
        }
        ncategory = await category.updateOne({ name, description, attributes: attributesArray })

        //redirect to view it updated if successful
        if(ncategory.acknowledged) {
            res.redirect(`/categories/${category._id}`)
            return
        }
        res.send('update failed')
    }
    catch(error){
        res.send(error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns view to delete a category
 */
exports.getDeleteCategory = async( req, res ) => {
    const id = req.params.id
    try{
        const category = await Category.findOne({ _id: id })
        if(!category){
            res.send('Category not found'); 
            return
        }
        res.render('categories/delete', { category })
    }
    catch(error){
        res.send(error.message)
    }
}
//delete a category
exports.deleteCategory = async ( req, res ) => {
    const id = req.params.id

    try{
        const success = await Category.deleteOne({ _id: id })
        if(success.deletedCount > 0){
            res.send('Deleted successfully')
        }
    }
    catch(error){
        res.send(error.message)
    }
}
