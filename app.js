const express =  require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
    .then(() => console.log(`MongoDB connected......`))
    .catch((err) => console.log(err));


//-------- third-party middleware

//handlebar middleware
app.engine('handlebars',
    exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));
//-------- third-party middleware

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Load Idea Model
require('./models/ideas');
const Idea = mongoose.model('ideas');

// Idea Index Page
app.get('/ideas', (req,res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});


//-------- From
// Add Idea Form
app.get('/ideas/add', (req,res) => {
    res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id',(req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit',{
            idea: idea
        });
        }
    );

});

// Process Form
app.post('/ideas', (req,res) => {
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
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
});

//Edit Form process
app.put('/ideas/:id', (req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea =>{
            //new Values
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save();

        });
    res.send('PUT');
});
//-------- From

const port = 5000;

// Index Route
app.get('/',(req,res) => {
    const title = 'Welcome';
    res.render('Index',
        {title: title}
        );
});

// About Route
app.get('/about',(req,res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server started on port ${port} yaasa`);
});