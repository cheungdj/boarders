const mongoose = require('mongoose');
const Spots = require('../models/spots');
const {adjective, component} = require('./seedHelpers')

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Spots.deleteMany({});
    for (let i = 0; i < 50; i++){
        const Spot = new Spots({
            title: `${sample(adjective)} ${sample(component)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer erat ipsum, sagittis a enim a, tempus elementum elit. Phasellus a augue ac nibh aliquam eleifend. Etiam at elit ac sem.',
            location: 'Toronto'
        })
        await Spot.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})