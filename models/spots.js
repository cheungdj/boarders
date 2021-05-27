const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpotsSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:String,
    location:String,
    image:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review' 
        }
    ]
});

module.exports = mongoose.model('Spots', SpotsSchema);