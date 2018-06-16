var app = angular.module('control', []);



 	   app.controller('productController', function($scope,$http) {
		// when landing on the page, get all product and show them	
		$http({
			    method: 'get', 
			    url: '/api/products'	
			}).then(function (response) {
			    $scope.products = response.data;
			},function (error){
		});

      		// when submitting the add product
		$scope.createProduct = function() {
		
			$http.post('/api/products', $scope.formData)
			.then(function(data) {
				$scope.formData = {}; // clear the form
				alert("Added Successfully");
			})
			.error(function(data) {
			});
		};
 	   });

	   
		app.controller('orderController', function($scope,$http) {
		// when landing on the page, get all order and show them	

		$scope.selected = {};		
	
		$http({
			    method: 'get', 
			    url: '/api/aProduct'	
			}).then(function (response) {
			    $scope.products = response.data;
			},function (error){
		});

		// when submitting the add order
		$scope.createOrder = function() {
				
			$scope.sentData = {predict : $scope.selected._id,pid :$scope.selected.pid,  quantity : $scope.formData.order};
			
			$http.post('/api/order', $scope.sentData)
			.then(function(data) {
				$scope.formData = {}; // clear the form
				$scope.order = data;
				alert("Added Successfully");	
			})
			.error(function(data) {
			});
		};
 	   });



	  app.controller('predictController', function($scope,$http) {
		// when landing on the page, get all product and show them	

		$http({
			    method: 'get', 
			    url: '/api/products'	
			}).then(function (response) {
			    $scope.products = response.data;
			    
			},function (error){
		});


		// when submitting the add predict or update,
		$scope.createPredict = function() {
			
			
			$scope.sentData = {pid : $scope.selected._id, predict : $scope.formData.predict}
			

			$http.post('/api/predict', $scope.sentData)
			.then(function(data) {
				$scope.formData = {}; // clear the form
				$scope.predict = data;
				alert("Added Successfully");	
			})
			.error(function(data) {
			});
		};
 	   });

	
		app.controller('displayController', function($scope,$http, $window) {
		// when landing on the page, get all display and show them	

		$scope.displays;
		$scope.init  = function() {
			
			var pusher = new Pusher('298ae66ee61693920520', {
      				cluster: 'ap2',
      				encrypted: true
    			});

			var socketId;
    			// retrieve the socket ID on successful connection
    			pusher.connection.bind('connected', function() {
    			    socketId = pusher.connection.socket_id;
				
    			});

			 var channel = pusher.subscribe('post-events');
    				channel.bind('postAction', function(data) {
				
				$scope.$apply(function(){
         				 $scope.displays = data;
      				});
    			});
		};
		

		$http({
			    method: 'get', 
			    url: '/api/display'	
			}).then(function (response) {
			    $scope.displays = response.data;
			    
			},function (error){
		});


		// when submitting the add done
		$scope.doneUpdate = function(id) {
			
			for (var i = 0 ;i < $scope.displays.length; i++) {
			 	if($scope.displays[i]._id === id){
					$scope.sData = $scope.displays[i]
				}
      		  	}
			
			$scope.sentData = {oid : $scope.sData._id, pid : $scope.sData.predictdetails._id,quantity : $scope.sData.quantity};
					
			$http.put('/api/done', $scope.sentData)
			.then(function(data) {
				
			})
			.error(function(data) {
			});
		};
 	   });



	  app.controller('reportController', function($scope,$http) {
		// when landing on the page, get all reports and show them	
		$scope.reports;
		$http({
			    method: 'get', 
			    url: '/api/report'	
			}).then(function (response) {
			    $scope.reports = response.data;
			    
				var obj = {a: 123, b: "4 5 6"};
				var obj1 = "Dish name Produced Predicted \n";	
				for(var i = 0; i < $scope.reports.length ; i++ )
				{
					var obj2 = ""+$scope.reports[i].p_name+": "+$scope.reports[i].createdtillnow+" "+$scope.reports[i].predicted+ "\n";
					obj1 = obj1.concat(obj2);
				}
		
				var data = "text/json;charset=utf-8," + encodeURIComponent(obj1);

				$('<a href="data:' + data + '" download="data.txt">Download Report </a>').appendTo('#container');			    
			},function (error){
		});
 	   });







