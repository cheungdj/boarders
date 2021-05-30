const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const mate = require('ejs-mate')
const Spots = require('./models/spots');
const methodOverride = require('method-override');
const AsyncHandle = require('./utils/AsyncHandler');
const ExpressError = require('./utils/ExpressError');
const {spotSchemaValidate, reviewSchemaValidate} = require('./utils/validateSchema.js');
const Review = require('./models/review');

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

//Validate spot schema using Joi vaidation
const validateSpot = (req, res, next) =>{
    const {error} = spotSchemaValidate.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchemaValidate.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

//GET request for home @url/
app.get('/', (req, res)=>{
    res.render('home')
})

//GET request for new spot form, @url/spots/newSpot
app.get('/spots/newSpot', AsyncHandle(async (req,res)=>{
    res.render('spots/new');
}));

//POST request for new spot form, redirects to new spot detail page on send
app.post('/spots/newSpot', validateSpot, AsyncHandle(async(req, res) => {
    if(!req.body.spots){
        throw new ExpressError('Invalid data', 400);
    }
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
    const spots = await Spots.findById(req.params.id).populate('reviews');
    if(!spots){
        throw new ExpressError("We ain't got that spot round here", 404);
    }
    res.render('spots/detail', {spots});
}));

//Route to POST new reviews for a spot
app.post('/spots/:id/reviews', validateReview,AsyncHandle(async(req,res) =>{
    const spots = await Spots.findById(req.params.id);
    if(!req.body.review){
        throw new ExpressError('Invalid data', 400);
    }
    const review = new Review(req.body.review);
    spots.reviews.push(review);
    await Promise.all([    spots.save(), review.save()]);
    res.redirect(`/spots/${spots._id}`);
}))

//GET request to edit spot of requested ID
app.get('/spots/:id/edit', AsyncHandle(async(req, res) =>{
    const spots = await Spots.findById(req.params.id);
    res.render('spots/edit', {spots});
}));

//PUT request to update spot with new information (used with edit page)
app.put('/spots/:id', AsyncHandle(async(req,res) =>{
    const {id} = req.params;
    const spots = await Spots.findByIdAndUpdate(id, {...req.body.spots});
    res.redirect(`/spots/${spots._id}`);

}));

//Route to delete review for specific spot ID
app.delete('/spots/:id/reviews/:reviewID', AsyncHandle(async(req,res) =>{
    const {id, reviewID} = req.params;
    await Spots.findByIdAndUpdate(id, {$pull: {reviews: reviewID} });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/spots/${id}`)
}));

//Route to delete specific spot
app.delete('/spots/:id', AsyncHandle(async(req, res) => { 
    const {id} = req.params;
    await Spots.findByIdAndDelete(id);
    res.redirect('/spots')
}));

//Route for pages that do not exist
app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404));
})

//Final error catch, defaults to 500 error code if no error was provided 
app.use((err, req, res, next)=>{
    const {statusCode = 500, message = 'Oops, something went wrong.'} = err;
    if(!err.message){
        err.message = "Something went wrong."
    }
    res.status(statusCode).render('error', {err});
}) 

//Catch for GET request if no route has been made yet
app.get('*', (req,res) =>{ res.send('We are still working on this part of the site.') })
//Listen on port 3000
app.listen(3000, ()=> {  
    console.log('serving on port 3000')
})