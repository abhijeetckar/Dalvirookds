


 var app = angular.module('starter', ['ngRoute','control']);

  // configure our routes
    app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

  
            .when('/order', {
                templateUrl : 'pages/order.html'
            })


            .when('/addproduct', {
                templateUrl : 'pages/product.html',
                controller  : 'productController'
            })

            .when('/addprediction', {
                templateUrl : 'pages/predict.html'
            })

            .when('/display', {
                templateUrl : 'pages/display.html'
            })

			  
            .when('/report', {
                templateUrl : 'pages/report.html'
            });

		
    });

 
