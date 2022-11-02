const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const userModel = require('../model/userModel')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt


// Configuring Passport Strategy.
passport.use( new JWTStrategy({
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) =>{
        try{
            return done(null, token.user)
        } catch(error){
            done(error)
        }
    }
    ))


    // With this passport middleware we can save the information provided by the user to the datebase and then pass the user information to the next middleware if succesful or throw an error.
    passport.use(
        'signup',
        new localStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    const first_name = req.body.first_name
                    const last_name = req.body.last_name
                    // const email = req.body.email
                    // const password = req.body.password
                    const user = await userModel.create({ first_name, last_name, email, password });
    
                    return done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );

  

//This passport middleware authenticates the user baased on the username and password provided in the initial passport middleware.
//I.e if the user is found to have created acct, it sends the user information to the next middleware, else it throws an error.

passport.use('login', new localStrategy({
    usernameField:'email',
    passwordField:'password'
},
async (email, password, done) => {
    try{

        const user = await userModel.findOne({email})
        console.log(user);
        
        if(!user)
        return done(null, false,{message: 'User not found'})
        
        const validate = await user.isValidPassword(password)
        if(!validate){
            return done(null, false, {message: 'Wrong Password'})
        }

        return done(null, user, {message: 'Logged in succesfully'})
        
    }catch(error){
        return done(error)
    }
}))