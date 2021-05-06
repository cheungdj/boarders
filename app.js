const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
mongoose.connect('mongodb://localhost:27017/darkslide-spots',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('*', (req,res) =>{
    res.send('We are still working on this part of the site.')
})


app.listen(3000), ()=> {  
    console.log('serving on port 3000')
}