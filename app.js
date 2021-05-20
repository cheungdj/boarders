const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const mate = require('ejs-mate')
const Spots = require('./models/spots');
const methodOverride = require('method-override');
const AsyncHandle = require('./utils/AsyncHandler');
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
app.engine('ejs', mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


//GET request for home @url/
app.get('/', (req, res)=>{
    res.render('home')
})

//GET request for new spot form, @url/spots/newSpot
app.get('/spots/newSpot', AsyncHandle(async (req,res)=>{
    res.render('spots/new');
}));

//POST request for new spot form, redirects to new spot detail page on send
app.post('/spots/newSpot', AsyncHandle(async(req, res) => {
    const spot = new Spots (req.body.spots);
    await spot.save();
    res.redirect(`/spots/${spot._id}`);
}));

//GET request of all spots on database
app.get('/spots', AsyncHandle(async(req, res)=>{
    const spots = await Spots.find({});
    res.render('spots/index', {spots});
}));

//GET request for specific spot ID in database, renders show page for requested ID
app.get('/spots/:id', AsyncHandle(async(req, res) =>{
    const spots = await Spots.findById(req.params.id);
    res.render('spots/detail', {spots});
}));

//GET request to edit spot of requested ID
app.get('/spots/:id/edit', AsyncHandle(async(req, res) =>{
    const spots = await Spots.findById(req.params.id);
    res.render('spots/edit', {spots});
}));

app.put('/spots/:id', AsyncHandle(async(req,res) =>{
    const {id} = req.params;
    const spots = await Spots.findByIdAndUpdate(id, {...req.body.spots});
    res.redirect(`/spots/${spots._id}`);

}));

app.delete('/spots/:id', AsyncHandle(async(req, res) => { 
    const {id} = req.params;
    await Spots.findByIdAndDelete(id);
    res.redirect('/spots')
}));

app.use((err, req, res, next)=>{
    res.send("Something went wrong.")
})

//Catch for GET request if no route has been made yet
app.get('*', (req,res) =>{ res.send('We are still working on this part of the site.') })
//Listen on port 3000
app.listen(3000, ()=> {  
    console.log('serving on port 3000')
})