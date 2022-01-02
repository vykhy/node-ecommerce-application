const User = require('../models/User')

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * create new user in database
 * @returns true or false whether signup was successful
 */
exports.userSignUp = async ( req, res) =>{
    const { name, email, password, confirm} = req.body

    //validate form
    if(name == '' || email  == '' || password == '' ){
        res.render('signup', {
            name, email, password, confirm, error: 'All fields are required'
        })
        return false
    }

    //confirm password
    if( password !== confirm ) { 
        res.render('signup', { name, email, password, confirm, error: 'Passwords do not match'})
        return false
    }
    
    //save to database and return true
    try{
        const user = await User.create({
                name,
                email,
                password
            })
        if(user) return true
        return false
    }
    catch(error){
        res.send(error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*true or false} verified 
 * if verified, automatically log in. In this case, it is pre confirmed by the application
 * create sessions
 * @returns boolean whether user login was successful
 */
exports.userLogin = async ( req, res, verified) =>{

    const { email, password } = req.body

    if(!verified && ( email  == '' || password == '' )){
        res.render('login', {
            email, password, error: 'All fields are required'
        })
        return false
    }
    
    try{
        const user = await User.findOne({ email: email })

        //Account was just created and is being automatically logged in
        if(verified){
            session = req.session
            session.user = user.name
            session.admin = false
            return true
        }
        //Check whether user exists
        if( !user ){
            res.render('login', {
                email, password, error: 'User with this email does not exist'
            })
            return false
        }

        //Check whether password is correct
        if(user.password !== password){
            res.render('login', {
                email, password, error: 'Password is wrong'
            })
            return false
        }

        session = req.session
        session.user = user.name
        session.admin = false
        return true
    }
    catch(error){
        res.send(error.message)
    }
}