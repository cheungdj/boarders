const Joi = require('joi');

module.exports.spotSchemaValidate = Joi.object({
    spots: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});
