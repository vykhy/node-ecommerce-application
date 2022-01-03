const router = require('express').Router()
const Category = require('../models/Category')
const categoryController = require('../controllers/categoryController')

//get categories
router.get('/', async ( req, res ) => {
    try{
        const categories = await Category.find()
        if(categories.length < 1 ) return res.send('No Categories exist at this moment')
        res.render('categories/categories', { categories })
    }
    catch(error){ res.send(error.message) }
})

//return page with form to create category
router.get('/create', ( req, res ) => {
    res.render('categories/create')
})

//create a category
router.post('/create', async ( req, res ) => {
    //create the category and redirect to view it
   const category = await categoryController.createCategory( req, res )
   if( category ) res.redirect(`/categories/${category._id}`)
})

//get a category
router.get('/:id', categoryController.getOneCategory )

//return page with update form
router.get('/update/:id', categoryController.getUpdateCategory)

//update a category
router.post('/update/:id', categoryController.updateCategory)

//return page with update form
router.get('/delete/:id', categoryController.getDeleteCategory)

//delete a category
router.post('/delete/:id', categoryController.deleteCategory)

module.exports = router