const express = require('express')
const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const userRouter = express.Router()

userRouter.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) =>{
    res.json({
        message: "SignUp successful",
        user: req.user
    })
})

userRouter.post('/login', async (req, res, next)=>{
    passport.authenticate('login', async (err, user, info)=> {
        try{
            if(err){
                return next(err)
            }
            if(!user){
                const error = new Error('Username or password is incorrect')
                return next(error)
            }
            req.login(user, {session: false},
                async (error)=> {
                    if (error) return next(error)


                    const body = { _id: user._id, email: user.email}
                    
                     //ADD EXPIRATION TIME, ONCE EXCEEDED, REFRESH TOKEN IS REQUIRED, AND USER IS LOGGED OUT
                        // OR THE USER NEEDS TO LOGIN AGAIN
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                    return res.json({token})
                }
                )
        } catch(error){
            return next(error)
        }
    } 
    ) (req, res, next)
})



module.exports = userRouter