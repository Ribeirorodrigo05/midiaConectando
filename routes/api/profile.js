const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//carregando o profile Modelo
const Profile = require('../../model/Profile');

//carregando usuário Modelo
const User = require('../../model/User');
const profile = require('../../validation/profile');

//validação profile
const validateProfileInput = require('../../validation/profile');

//validação experiência
const validateExperienceInput = require('../../validation/experience');

//validação experiência
const validateEducationInput = require('../../validation/education');
//rota profile
//rota privada 

router.get('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
    const errors = {};

    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
    .then(profile =>{
        if(!profile){
            errors.noprofile = 'No profile found';
            return res.status(400).json(errors);
        }
        res.json(profile)
    })
    .catch((err)=> res.json(err))
});
    //rota handle
    router.get('/handle/:handle',(req,res)=>{
        const errors = {};
        Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'No profile found'
                res.status(400).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(400).json(err))


    });

    //adquirindo profile pelo id
    router.get('/user/:user_id',(req,res)=>{
        const errors = {};
        Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'No profile found'
                res.status(400).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(400).json(err))


    });

    //adquirindo todos os profile
    router.get('/all',(req,res)=>{
        Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles=>{
            if(!profiles){
                errors.noprofile = 'There are no profile';
                return res.status(400).json(errors)
            }
            res.json(profiles)
        })
        .catch(err => {
            res.status(400).json({profile:'There are no profiles'})
        })
    })



router.post('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
    //adquirindo os campos do profile
    const {errors, isValid} = validateProfileInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;

    if(req.body.handle) profileFields.handle = req.body.handle;

    if(req.body.company) profileFields.company = req.body.company;

    if(req.body.website) profileFields.website = req.body.website;

    if(req.body.location) profileFields.location = req.body.location;

    if(req.body.bio) profileFields.bio = req.body.bio;

    if(req.body.status) profileFields.status = req.body.status;

    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skills recebe um array 
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    profileFields.social = {};

    if(req.body.youtube) profileFields.youtube = req.body.youtube;
    
    if(req.body.twitter) profileFields.twitter = req.body.twitter;

    if(req.body.facebook) profileFields.facebook = req.body.facebook;

    if(req.body.linkedin) profileFields.linkedin = req.body.linkedin;

    if(req.body.instagram) profileFields.instagram = req.body.instagram;

    //update do profile
    Profile.findOne({user: req.user.id})
    .then(profile=>{
        if(profile){
            //update profileField
            Profile.findOneAndUpdate(
                {user:req.user.id}, 
                {$set: profileFields},
                {new:true})
                .then(profile=>res.json(profile))
        }else{
            Profile.findOne({handle: profileFields.handle}).then(profile=>{
                if(profile){
                    errors.handle = 'Esse profile já existe';
                    res.status(400).json(errors)

                }

                new Profile(profileFields).save().then(profile=>res.json(profile))
            })
        }
    })

});

//rota para adicionar experiência
router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid} = validateExperienceInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    
    Profile.findOne({user: req.user.id})
    .then(profile =>{
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        //adicionando o arrayde experiência
        profile.experience.unshift(newExp)

        profile.save().then(profile=> res.json(profile))
    })
})

//rota para adicionar formação acadêmica
router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid} = validateEducationInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    
    Profile.findOne({user: req.user.id})
    .then(profile =>{
        const newEducation = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        //adicionando o array 
        profile.experience.unshift(newEducation)

        profile.save().then(profile=> {
            const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

            profile.experience.splice(removeIndex, 1);

            //save
            profile.save().then(profile=> res.json(profile));
        })
        .catch(err => res.status(400).json(err))
    })
})

//rota Delete experience
router.post('/experience/:exp_id', passport.authenticate('jwt', {session:false}), (req,res)=>{
    Profile.findOne({user: req.user.id})
})

module.exports = router;