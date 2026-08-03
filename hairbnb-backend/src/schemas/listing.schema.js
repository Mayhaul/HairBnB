import Joi from "joi";

export const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null).required() 
        
    })
})
// we alr have a feature to check validations 
// in the new form but JOI is useful when a person
// sends a req from an external source like hopscotch.
// client side validation can be easily bypassed
// but with this we avoid it.


// this is diff from mongoose validation because 
// this happens earlier in the req res cycle.
// this is diff from the client side validation
// because it can be easily bypassed through hopscotch etc