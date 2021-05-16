const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpotsSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:String,
    location:String,
    image:String
});

module.exports = mongoose.model('Spots', SpotsSchema);