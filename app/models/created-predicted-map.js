
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var currentdate = new Date();
var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();


var Schema = mongoose.Schema;

var predictSchema = new Schema({  
    pid: { type: Schema.ObjectId, ref: 'productmodels', required: true},
    createdtillnow: { type: Number, default: 0},
    predicted: {type: Number, required: true},
    created_date: { type: String, default: datetime }

});

module.exports = mongoose.model("predictCreateModel", predictSchema);  




