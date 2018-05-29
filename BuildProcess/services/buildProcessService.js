"use strict";

angular.module("buildProcessService", [])

  .service("buildProcessService", ["$q", "$http", "$rootScope", "buildProcessFactory",
	  function ($q, $http, $rootScope, buildProcessFactory) {

		  var self = this;

		  self.data = {};

		  // Service function to retrieve all of the tasks
		  self.getTasks = function () {

			  var deferred = $q.defer();

			  buildProcessFactory.getTasks().then(function (response) {

			  	  // If we needed to process each task item, we would do it here.
				  // Examples include: augmenting with data from other lists, etc.
				  angular.forEach(response, function (obj, index) {

				  });

				  self.data.tasks = response;
				  deferred.resolve();

			  });

			  return deferred.promise;

		  };

	  }]);

