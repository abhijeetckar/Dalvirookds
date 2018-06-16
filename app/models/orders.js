var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var currentdate = new Date();
var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();


var Schema = mongoose.Schema;

var orderSchema = new Schema({  
        pid: { type: Schema.ObjectId, ref: 'productmodels', required: true},
    	quantity: { type: Number, required: true},
    	predict_id: { type: Schema.ObjectId, ref: 'predictCreateModel', required: true},
    	status: { type: Boolean, required: true, default: false},
    	created_date: { type: String, default: datetime}
});

module.exports = mongoose.model("orderModel", orderSchema);  






