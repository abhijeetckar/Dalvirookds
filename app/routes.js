var Product = require('./models/product');
var PredictMap = require('./models/created-predicted-map');
var Order = require('./models/orders');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '498910',
  key: '298ae66ee61693920520',
  secret: '0884f570713a647a09a3',
  cluster: 'ap2',
  encrypted: true
});


module.exports = function(app) {

	// api ---------------------------------------------------------------------

	// get all products
	app.get('/api/products', function(req, res) {

		// use mongoose to get all product in the database
		Product.find(function(err, products) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(products); // return all products in JSON format
		});
	
		
	});

	// create product and send back all products after creation
	app.post('/api/products', function(req, res) {

		Product.create({
			p_name : req.body.p_name
		}, function(err, product) {
			if (err)
				res.send(err);

			Product.find(function(err, products) {
				if (err)
					res.send(err)
				res.json(products);
			});
		});

	});


	// create predict
	app.post('/api/predict', function(req, res) {

		var currentdate = new Date();
		var datetime = currentdate.getDate() + "/"
		    + (currentdate.getMonth()+1)  + "/"
		    + currentdate.getFullYear();


		 PredictMap.aggregate([
    			{
				"$match":
    				 {
				     
					"created_date":datetime,
					 "pid": ObjectId(req.body.pid)  
    				 }
			}
    		], function(err, data) {
    			if (err) throw err;
			if(data.length === 0)
			{

				PredictMap.create({
					pid : req.body.pid,
					predicted : req.body.predict
				}, function(err, predict) {
					if (err)
						res.send(err);
	
					res.status(201);
				});
				
				
			}
    			else {
				var updateDoc ={ predicted : req.body.predict, created_date : datetime};

				PredictMap.updateOne({pid: ObjectId(req.body.pid)}, updateDoc, function(err, doc) {
    					if (err) {
    					  res.send(err);
    					} else {
    					  res.status(204);
    					}
  				});


			}	
  		});

	

	});


	// get only predicted products
	app.get('/api/aProduct', function(req, res) {

		var currentdate = new Date();
		var datetime = currentdate.getDate() + "/"
		    + (currentdate.getMonth()+1)  + "/"
		    + currentdate.getFullYear();

		 PredictMap.aggregate([
    			{
				"$match":
    				 {
    				    "created_date":datetime
    				 }
			},
			{ 
				"$lookup":
       				{
        				"from": "productmodels",
         				"localField": "pid",
         				"foreignField": "_id",
         				"as": "productdetails"
       				}
     			}
    		], function(err, data) {
    			if (err) throw err;
    			res.json(data);	
  		});
		
	});

	// get display products
	app.get('/api/display', function(req, res) {

		var currentdate = new Date();
		var datetime = currentdate.getDate() + "/"
		    + (currentdate.getMonth()+1)  + "/"
		    + currentdate.getFullYear();

		 Order.aggregate([
    			{
				"$match":
    				 {
    				    "created_date":datetime,
				    "status": false
    				 }
			},
			{ 
				"$lookup":
       				{
        				"from": "productmodels",
         				"localField": "pid",
         				"foreignField": "_id",
         				"as": "productdetails"
       				}
     			},
    			{
    			    	$unwind: "$productdetails"
    			},
    			{
        			$lookup: {
        				"from": "predictcreatemodels",
        				"localField": "predict_id",
        				"foreignField": "_id",
            				"as": "predictdetails"
        			}
    			},
    			{
        			$unwind: "$predictdetails"
    			}
    		], function(err, data) {
    			if (err) throw err;
    			res.json(data);	
  		});

	
	
		
	});


	// create order
	app.put('/api/done', function(req, res) {

				var updateDoc ={ status : true};

				Order.updateOne({_id: ObjectId(req.body.oid)}, updateDoc, function(err, doc) {
    					if (err) {
    					  res.send(err);
    					} else {

						
						PredictMap.update(
   							{ _id: ObjectId(req.body.pid) },
   							{ $inc: { "createdtillnow" : req.body.quantity } }
						, function(err, order) {
							if (err)
								res.send(err);
							//console.log(order);

							var currentdate = new Date();
							var datetime = currentdate.getDate() + "/"
							    + (currentdate.getMonth()+1)  + "/"
							    + currentdate.getFullYear();

							 Order.aggregate([
    							{
								"$match":
    								 {
    								    "created_date":datetime,
								    "status": false
    								 }
							},
							{ 
								"$lookup":
       								{
        								"from": "productmodels",
         								"localField": "pid",
         								"foreignField": "_id",
         								"as": "productdetails"
       								}
     							},
    							{
    							    	$unwind: "$productdetails"
    							},
    							{
        							$lookup: {
        								"from": "predictcreatemodels",
        								"localField": "predict_id",
        								"foreignField": "_id",
            								"as": "predictdetails"
        							}
    							},
    							{
        							$unwind: "$predictdetails"
    							}
    							], function(err, data) {
    								if (err) throw err;
    								//res.json(data);	
								console.log(data);
								 pusher.trigger('post-events', 'postAction', data , req.body.socketId);
            							 res.send('');
				
  							});




						});

					
					
    					  res.status(204);
    					}
  				});


	});

	// create order
	app.post('/api/order', function(req, res) {

		Order.create({
			pid : req.body.pid,
			quantity : req.body.quantity,
			predict_id : req.body.predict
		}, function(err, order) {
			if (err)
				res.send(err);

			//res.status(201).json(order);

			var currentdate = new Date();

			var datetime = currentdate.getDate() + "/"
				    + (currentdate.getMonth()+1)  + "/"
				    + currentdate.getFullYear();

							 Order.aggregate([
    							{
								"$match":
    								 {
    								    "created_date":datetime,
								    "status": false
    								 }
							},
							{ 
								"$lookup":
       								{
        								"from": "productmodels",
         								"localField": "pid",
         								"foreignField": "_id",
         								"as": "productdetails"
       								}
     							},
    							{
    							    	$unwind: "$productdetails"
    							},
    							{
        							$lookup: {
        								"from": "predictcreatemodels",
        								"localField": "predict_id",
        								"foreignField": "_id",
            								"as": "predictdetails"
        							}
    							},
    							{
        							$unwind: "$predictdetails"
    							}
    							], function(err, data) {
    								if (err) throw err;
    								//res.json(data);	
								console.log(data);
								 pusher.trigger('post-events', 'postAction', data , req.body.socketId);
            							 res.send('');
				
  							});

		
		});

	});


	// get report
	app.get('/api/report', function(req, res) {

		var currentdate = new Date();
		var datetime = currentdate.getDate() + "/"
		    + (currentdate.getMonth()+1)  + "/"
		    + currentdate.getFullYear();

		 PredictMap.aggregate([
    			{
				"$match":
    				 {
    				    "created_date":datetime
    				 }
			},
			{ 
				"$lookup":
       				{
        				"from": "productmodels",
         				"localField": "pid",
         				"foreignField": "_id",
         				"as": "productdetails"
       				}				
     			},
    			{   
				"$unwind":"$productdetails" 
			},
			{   
        			"$project":
				{
        			    "_id" : 1,
        			    "p_name" : "$productdetails.p_name",
        			    "createdtillnow" : 1,
        			    "predicted" : 1
       				 } 
    			}
    		], function(err, data) {
    			if (err) throw err;
    			res.json(data);	
			console.log(data);
  		});
		
	});





	var path = require('path');
	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendFile(path.resolve('./public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
	});
};
