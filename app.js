const express =  require('express');

const app = express();

const port = 5000;

// Index Route
app.get('/',(req,res) => {
    res.send('Index');
});

app.get('/about',(req,res) => {
    res.send('About');
});

app.listen(port, () => {
    console.log(`Server started on port ${port} yaasa`);
});