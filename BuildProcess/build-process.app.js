"use strict";

// Branding
import "./scss/build-process.scss";

// Services
import "./services";

angular.module("build-process", [
	"ngRoute",
	"buildProcessService",
	"buildProcessFactory"
])
  .config(function ($routeProvider, $httpProvider, $locationProvider) {

	  $locationProvider.html5Mode({
		  enabled: true,
		  requireBase: true
	  }).hashPrefix("!");

	  $routeProvider

		.when("/", {
			template: "<build-process-dashboard></build-process-dashboard>",
			component: "build-process"
		})

		.otherwise({
			redirectTo: "/"
		});

  });

require("./components/index");