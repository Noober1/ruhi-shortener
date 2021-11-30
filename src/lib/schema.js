const Joi = require('joi')

const schema = Joi.object({
    url: Joi.string().trim().uri().required(),
    permalink: Joi.string().trim().max(20).required(),
    dateCreated: Joi.date()
})

module.exports = schema