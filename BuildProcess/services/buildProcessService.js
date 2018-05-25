"use strict";

angular.module("buildProcessService", [])

  .service("buildProcessService", ["$q", "$http", "$rootScope", "buildProcessFactory",
	  function ($q, $http, $rootScope, buildProcessFactory) {

		  var self = this;

		  self.data = {};

		  self.getTasks = function () {

			  var deferred = $q.defer();

			  buildProcessFactory.getTasks().then(function (response) {

				  angular.forEach(response, function (obj, index) {

				  });

				  self.data.tasks = response;
				  deferred.resolve();

			  });

			  return deferred.promise;

		  };

	  }]);

