import Joi from 'joi';

export const reviewSchema = Joi.object({
    review: Joi.object({
        user: Joi.string()
            .hex()
            .length(24)
            .optional()
            .allow(null, ''), // Allows optional user field
        comment: Joi.string()
            .trim()
            .optional()
            .allow(''), // Matches optional comment in Mongoose schema
        rating: Joi.number()
            .min(0)
            .max(5)
            .optional()
            .messages({
                'number.min': 'Rating must be a minimum of 0',
                'number.max': 'Rating must be a maximum of 5'
            })
    }).required()
});