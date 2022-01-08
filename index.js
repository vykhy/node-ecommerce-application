//PACKAGES
const express = require('express')
const app = express()
const env = require('dotenv')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

//CONSTANTS
env.config()
const PORT = process.env.APP_PORT

//ROUTERS
const authRouter = require('./routes/auth')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')

//APP SETUP AND MIDDLEWARES
app.use(express.static(__dirname));
app.use(cookieParser())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

mongoose.connect( process.env.DB_URL , () => console.log('db connected...'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    cookie: { maxAge: 1000*60*60*24 },
    saveUninitialized: false
}))

app.use(function(req, res, next) {
    req.session.uid = 'a123d4568964'
    req.session.user = 'Vykhy the billionaire'
    req.session.cart = '61d3db26153420b6848e5e50'
    res.locals.session = req.session;
    next();
});

//ROUTES
app.get('/', (req, res ) => res.render('home') )
app.use('/auth', authRouter)
app.use('/categories', categoryRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)

//test route
app.get('/protected', ( req, res ) => {
    if(!req.session.user) return res.send('UNAUTHORIZED')
    res.send(req.session.user)
})

app.listen(PORT)

/**
 * NEXT TIME
 * 
 * CREATE ORDER AND GET ITS ID
 * ADD ADDRESSE TO ORDER
 * DELETE ORDER
 * VIEW ORDERS PAGE
 * BILLING
 * IMPLEMENT PRODUCT IMAGES
 * UPDATE LOGIN AND AUTH SYSTEM
 * CKEDITOR FOR PRODUCTS.LONG_DESCRIPTION
 * HOME PAGE DESIGN
 * NAVBAR AND FOOTER
 * IMPLEMENT REDIS
 *  - products
 *  - recommendations
 *  - updates
 *  - cart
 * SHIPPING API
 * 
 * ADMIN, PROBABLY
 */
