var mongoose = require('mongoose');


module.exports = mongoose.model('productModel', {
	p_name : { type: String, required: true, unique: true }
});
