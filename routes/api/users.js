const express = require('express');
const router = express.Router();
const User = require('../../model/User');
const gravatar =  require('gravatar');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')



//rota de login 
//rota pública
router.post('/register',(req,res)=>{
    const {errors, isValid} = validateRegisterInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }


    User.findOne({email: req.body.email})
    .then((user)=>{
        if(user){
            errors.email = 'Email already exists'
            res.status(400).json(errors)
        }else{
            const avatar = gravatar.url(req.body.email,{
                s:'200',
                r:'pg',
                d:'mm'      
            })

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err))
                })
            })
        }
    })
})

/* Rota de Login 
 validação do email e senha
 criação do payload para gerar o token*/
router.post('/login',(req,res)=>{

    const {errors, isValid}  = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then((user)=>{
        if(!user){
            errors.email = 'The Email not found'
            res.status(404).json(errors)
        }
        bcrypt.compare(password, user.password)
        .then((isMatch)=>{
            if(isMatch){
                // o usuário foi achado 
                //criando o payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                 }
                 //criando e assinando token de autenticação
                 jwt.sign(
                     payload, 
                     keys.secretOrKey,
                      {expiresIn:3600}, 
                      (err, token)=>{
                        res.json({
                            token:'Bearer ' + token
                        })
                 })

            }else{
                errors.password = 'Password is incorrect'
                res.status(400).json(errors)
            }
        })
    })

})


//Rota privada
//autenticação para acesso






module.exports = router;