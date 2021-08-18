const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//model Post 
const Post = require('../../model/Post')

// Model Profile
const Profile = require('../../model/Profile')


//validação Comentários
const validatePostInput = require('../../validation/post')

//fazendo a leitura do post
router.get('/',(req,res)=>{
    Post.find()
    .sort({date: -1})
    .then(post => res.json(posts))
});

//obtendo o post pelo ID
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Nenhum comentário encontrado com esse ID'));
})




//rota de criação de post
router.post('/', passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isvalid} = validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.body.id
    });

    newPost.save().then(post => res.json(post));

})

//rota Delete Posts
router.delete('/:id', passport.authenticate('jwt', {session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.user.toString() !== req.user.id){
                return res.status(401).json({notauthorized:'Não autorizado'})
            }

            post.remove().then(() => res.json({success: true}))
            .catch( err => res.status(404).json({postnotfound:'post não encontrado'}))
        })
    })
});

// criando like
router.post('/like/:id', passport.authenticate('jwt', {session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({alreadyliked:'O usuário já curtiu esse post'});
            }
            post.likes.unshift({user: req.user.id});
            post.save().then(post => res.json(post));
        })
        .catch( err => res.status(404).json({postnotfound:'post não encontrado'}))
    })
});


//criando unlike
router.post('/unlike/:id', passport.authenticate('jwt', {session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                return res.status(400)
                .json({notliked:'nenhuma curtida'});
            }

            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);

            post.save().then(post => res.json(post))
            
        })
        .catch( err => res.status(404).json({postnotfound:'post não encontrado'}))
    })
});

//criando comentário
router.post('/comment/:id', passport.authenticate('jwt', {session:false}),(req,res)=>{
    
    const {errors, isvalid} = validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }
    Post.findById(req.params.id)
    .then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        //adicionando o comentário ao array 
        post.comments.unshift(newComment)
        //salvando
        post.save().then(post => res.json(post))
    })
    .catch( err => res.status(404).json({postnotfound:'post não encontrado'}))

});

//removendo um comentário 
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session:false}),(req,res)=>{
    Post.findById(req.params.id)
    .then(post => {
       //verificando o comentário
       if(post.comments.filter(comments => comments._id.toString() === req.params.comment_id).length === 0){
           return res.status(404).json({commmentsnoexists:'O comentário não foi achado'})
       }
       //removendo o comentário
       const removeIndex = post.comments.comments
       .map(item => item._id.toString())
       .indexOf(req.params.comment_id);

       post.comments.splice(removeIndex, 1);
       post.save().then(post => res.json(post))
    })
    .catch( err => res.status(404).json({postnotfound:'post não encontrado'}))

});
module.exports = router;