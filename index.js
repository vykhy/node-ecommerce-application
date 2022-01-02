//PACKAGES
const express = require('express')
const app = express()
const env = require('dotenv')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const userSession = require('./middlewares/userSession')

//CONSTANTS
env.config()
const PORT = process.env.APP_PORT

const authRouter = require('./routes/auth')

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
    res.locals.user = req.session.user;
    next();
});

//ROUTES
app.get('/', (req, res ) => {
    res.render('home')
})
app.use('/auth', authRouter)

//test route
app.get('/protected', ( req, res ) => {
    if(!req.session.user) return res.send('UNAUTHORIZED')
    res.send(req.session.user)
})

app.listen(PORT)