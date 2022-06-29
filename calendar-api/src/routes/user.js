const express = require('express');
const User = require('../models/user');
const auth = require('../security/auth');

const router = express.Router();

/* 
 * CREATE new user 
 */
router.post('/', async function(req, res){
    try{
        const user = new User(req.body);
        await user.save();

        const token = await auth.generateAuthToken(user);

        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send({error: e});
    }
});

/* 
 * CREATE new jwt token 
 */
router.post('/login', async function(req, res){
    try {
        const login = {email: req.body.email, password: req.body.password};
        console.log(login);
        if(!login.email || !login.password){
            throw 'Invalid data format';
        }

        const user = await User.findOne({email: login.email}); 

        if (user && await auth.isCorrectCredentials(user, login.password)){
            const token = await auth.generateAuthToken(user);
            res.status(200).send({user, token});
        } else {
            throw 'Bad credentials';
        }
    } catch(e) {
        res.status(401).send({error: e});
    }
});

/* 
 * READ list of all user 
 */
router.get('/', auth.validateToken, async function(req, res){
    try{
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.status(500).send({error: e});
    }
});

/* 
 * READ user data
 */
router.get('/:id', auth.validateToken, async function(req, res){
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        if(user){
            res.send(user);
        } else {
            res.status(404).send({id, message: 'User not found'});
        }
    } catch(e) {
        res.status(500).send({error: e});
    }
});

/*
 * UPDATE user 
 */
router.patch('/', auth.validateToken, async function(req, res){
    try{
        const newName = req.body.name;
        //const user = await User.findByIdAndUpdate({_id: req.user._id}, {name: newName}, {new: true});

        const user = req.user;
        user.name = newName;
        await user.save();

        res.send(user);
    } catch(e) {
        res.status(500).send({error: e});
    }
});

/*
 * DELETE user 
 */
router.delete('/', auth.validateToken, async function(req, res){
    try{
        const user = req.user;
        await User.deleteOne(user);

        res.send({deletedUser: user});
    } catch(e) {
        res.status(500).send({error: e});
    }
});

router.post('/logout', auth.validateToken, async function(req, res){
    try{
        const user = req.user;
        const token = req.token;
        user.auth = user.auth.filter(item => item.token !== token);

        await user.save();

        res.status(200).send();
    } catch(e) {
        res.status(500).send({error: e});
    }
});

router.post('/logout/all', auth.validateToken, async function(req, res){
    try {
        const user = req.user;
        user.auth = [];
        await user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send({error: e});
    }
});

module.exports = router;