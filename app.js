const express =  require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

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

//Express Session middleware
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Connect flash middleware
app.use(flash());

// Global variable for flash
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');// for passport
    next();
});

//Static folder
app.use(express.static(path.join(__dirname,'public')));
//-------- third-party middleware


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

//ideas routes
app.use('/ideas',ideas);

//users route
app.use('/users',users);

const port = 5000;


app.listen(port, () => {
    console.log(`Server started on port ${port} yaasa`);
});