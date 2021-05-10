const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const Spots = require('./models/spots');

//Connecting mongoose to mongoDB
mongoose.connect('mongodb://localhost:27017/darkslide-spots',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

//Log succesful connection to mongoDB, otherwise throw an error on unsuccessful connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open",() => {
    console.log("Connected to Database 🖥")
})

//Set view engine as ejs, so express knows we are using ejs files for views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//GET request for home @url/
app.get('/', (req, res)=>{
    res.render('home')
})

//GET request for new spot form, @url/newSpot
app.get('/newSpot', async (req,res)=>{
    const spot = new Spots({title: 'Local Skate Test'})
    await spot.save();
    res.send(spot);
})

//Catch for GET request if no route has yet been made
app.get('*', (req,res) =>{ res.send('We are still working on this part of the site.') })

//Listen on port 3000
app.listen(3000), ()=> {  
    console.log('serving on port 3000')
}