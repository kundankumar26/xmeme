const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Meme = require("../models/memes");
const MEME_URL = "https://mymeme.herokuapp.com//memes/"

//GET ALL MEMES
router.get('/', (req, res) => {
    Meme.find()
    .then(items => {
        const result = items.map(item => {
                return {
                    id: item._id,
                    name: item.name,
                    caption: item.caption,
                    url: item.url,
                    createdOn: item.createdOn
                }
            });
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    });
});

//CREATE A MEME
router.post('/', (req, res) => {
    const meme = new Meme({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        caption: req.body.caption,
        url: req.body.url,
        createdOn: Date.now()
    });
    //console.log(meme);

    meme.save()
    .then(item => {
        const result = {
            id: item._id
        }
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    });
});

//GET A SINGLE MEME
router.get('/:memeId', (req, res) => {
    const id = req.params.memeId;
    Meme.findById(id)
    .then(item => {
        const result = {
            id: item._id,
            name: item.name,
            caption: item.caption,
            url: item.url,
            date: item.date
        };
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    });
});

//UPDATE A SINGLE MEME
router.patch('/:memeId', (req, res) => {
    const id = req.params.memeId;
    const updateOps = {};
    for(const [key, value] of Object.entries(req.body)){
        updateOps[key] = value;
    }
    Meme.updateOne({ _id: id }, {$set: updateOps })
    .then(item => {
        console.log(item);
        const itemModified = item.nModified;
        console.log(itemModified);
        if(itemModified){
            Meme.findById(id)
            .then(item => {
                const result = {
                    id: id,
                    name: item.name,
                    caption: item.caption,
                    url: item.url,
                    createdOn: item.createdOn,
                }
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({message: "Problem in API"})
            })
        }
        else{
            res.send(400).json({message: "username is not editable"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    });
});

//DELETE A MEME
router.delete('/:memeId', (req, res) => {
    const id = req.params.memeId;
    Meme.findById(id)
    .then(item => {
        console.log(item);
        if(!item)
            return res.status(404).json({message: "Meme not found"});
        else{
            Meme.deleteOne({_id: id})
            .then(item => {
                const result = {
                    description: "1 meme deleted",
                    request: {
                        type: 'DELETE',
                        url: MEME_URL
                    }
                }
                console.log(item);
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    });
    
});

module.exports = router;