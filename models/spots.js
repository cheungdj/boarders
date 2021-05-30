const mongoose = require('mongoose');
const Review = require('./review');
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

//Mongoose post middleware that deletes all matching ID reviews from review database 
//if a spot w/reviews was deleted. 
SpotsSchema.post('findOneAndDelete', async function(removedDoc) {
    if(removedDoc){
        await Review.deleteMany({
            _id: {
                $in: removedDoc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Spots', SpotsSchema);