const express = require('express')
const request = require('supertest')
const userModel = require('../model/userModel')
const app = require('../index')
// const connect = require('../db')



describe('Auth: Signup', () => {
    let conn;

    beforeAll(async () => {
        conn = await connect()
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should signup a user', async () => {
        const response = await request(app).post('/signup')
        .set('content-type', 'application/json')
        .send({ 
            username: 'chinuaachebe', 
            password: 'achebe123', 
            firstName: 'chinua',
            lastName: 'Achebe',
            email: 'chinuaachebe@mail.com'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('username', 'chinuaachebe')
        expect(response.body.user).toHaveProperty('firstname', 'chinua')
        expect(response.body.user).toHaveProperty('lastname', 'Achebe')
        expect(response.body.user).toHaveProperty('email', 'chinuaachebe@mail.com')        
    })


    it('should login a user', async () => {
        // create user in out db
        const user = await UserModel.create({ username: 'chinuaachebe', password: 'achebe123'});

        // login user
        const response = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: 'chinuaachebe', 
            password: 'achebe123'
        });
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')      
    })
})