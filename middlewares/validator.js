const joi = require('joi');

const validateBlogMiddleWare = (req, res, next) => {
	const blogPayload = req.body;
	const { error } = blogValidator.validate(blogPayload);

	if (error) {
		console.log(error);
		return res.status(406).send(error.details[0].message);
	}

	next();
};

const blogValidator = joi.object({
	title: joi.string().min(5).max(255).required(),
	shortDescription: joi.string().min(5).max(255).optional(),
	year: joi.number().min(1900).max(2023).required(),
	isbn: joi.string().min(10).max(13).required(),
	price: joi.number().min(0).required(),
	createAt: joi.date().default(Date.now()),
	lastUpdateAt: joi.date().default(Date.now()),
});

module.exports = validateBlogMiddleWare;
