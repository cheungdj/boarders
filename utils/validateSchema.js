const Joi = require('joi');

//Joi schema for validating spots when adding them to the mongo DB

module.exports.spotSchemaValidate = Joi.object({
    spots: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required()
    }).required()
});


module.exports.reviewSchemaValidate = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5)
    }).required()


});