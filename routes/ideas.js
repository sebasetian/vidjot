const express =  require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helper/auth');


// Load Idea Model
require('../models/ideas');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/',ensureAuthenticated, (req,res) => {
    Idea.find({user:req.user.id})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});



//-------- From
// Add Idea Form
router.get('/add',ensureAuthenticated, (req,res) => {
    res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id',ensureAuthenticated,(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
                if (idea.user !== req.user.id) {
                    req.flash('error_msg', 'Not Authorized');
                    res.redirect('/ideas');
                } else {
                    res.render('ideas/edit', {
                        idea: idea
                    });
                }
            }
        );

});

// Process Form
router.post('', (req,res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({text:`Please add a title`});
    }
    if(!req.body.details){
        errors.push({text:`Please add some details`});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        };
        new Idea(newUser)
            .save()
            .then(() => {
                req.flash('success_msg','Video idea added');
                res.redirect('/ideas');
            })
    }
});

//Edit Form process
router.put('/:id', (req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea =>{
            //new Values
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save();

        });
    req.flash('success_msg','Video idea updated');
    res.redirect('/ideas')
});

//Delete Form process
router.delete('/:id', (req,res) => {
    Idea.remove({_id: req.params.id})
        .then(() =>{
            req.flash('success_msg','Video idea removed');
            res.redirect('/ideas')
        });
});
//-------- Form
module.exports = router;