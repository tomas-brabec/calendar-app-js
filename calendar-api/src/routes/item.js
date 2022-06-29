const express = require('express');
const auth = require('../security/auth');
const Item = require('../models/item');

const router = express.Router();

/*
 * Vzdy vyzadovat autentizaci
 */
router.use(auth.validateToken);

/* 
 * CREATE new item 
 */
router.post('/', async function(req, res){
    try{
        const item = new Item(req.body);

        item.userid = req.user._id;
        await item.save();
        console.log(item._id)
        console.log(item)

        res.status(201).send({ item });
    } catch(e) {
        res.status(400).send({error: e});
    }
});

/* 
 * READ list of items 
 */
router.post('/find', async function(req, res){
    try{
        const from = new Date(req.body.from);
        const to = new Date(req.body.to);

        const userid = req.user._id;
        const items = await Item.find({userid: userid, date: {
            '$gte': from,
            '$lte': to
        }});
        res.send({ items });
    } catch(e) {
        res.status(400).send({error: e});
    }
});

/* 
 * UPDATE item
 */
router.patch('/', async function(req, res){
    try{
        const id = req.body._id;
        const newTitle = req.body.title;

        const item = await Item.findByIdAndUpdate({_id: id}, {title: newTitle}, {new: true});
 
        await item.save();

        res.send(item);
    } catch(e) {
        res.status(500).send({error: e});
    }
});

/* 
 * DELETE item
 */
router.delete('/', async function(req, res){
    try{
        const id = req.body._id;
        console.log(req.body)

        const item = await Item.findByIdAndRemove({_id: id});
 
        //await item.save();

        res.send(item);
    } catch(e) {
        res.status(500).send({error: e});
    }
});

module.exports = router;