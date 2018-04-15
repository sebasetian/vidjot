const express =  require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
    .then(() => console.log(`MongoDB connected......`))
    .catch((err) => console.log(err));

// Load Idea Model
require('./models/ideas');
const Idea = mongoose.model('ideas');

//handlebar middleware
app.engine('handlebars',
    exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



const port = 5000;

// Index Route
app.get('/',(req,res) => {
    const title = 'Welcome';
    res.render('Index',
        {title: title}
        );
});

app.get('/about',(req,res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server started on port ${port} yaasa`);
});