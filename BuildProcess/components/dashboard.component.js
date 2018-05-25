"use strict";

angular.module("build-process")

  .component("buildProcessDashboard", {
	  template: require("./dashboard.tmpl.html"),
	  controller: "buildProcessDashboardController",
	  controllerAs: "vm"
  })


  .controller("buildProcessDashboardController", ["$sce", "$q", "$filter", "$location", "buildProcessService", "buildProcessFactory",
	  function ($sce, $q, $filter, $location, buildProcessService, buildProcessFactory) {

		  var vm = this;

		  vm.data = buildProcessService.data;

		  vm.$onInit = function () {


			  buildProcessService.getTasks().then(function() {

				  vm.statusMessage = "Hello world";

			  });

		  };

	  }]);