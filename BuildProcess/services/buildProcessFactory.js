"use strict";

angular.module("buildProcessFactory", [])

    .factory("buildProcessFactory", function ($http, $q, $rootScope) {

            let self = this;

            /* CONSTRUCTORS */

            // Constructor for a Task object
            var Task = function (obj) {

                if (obj) {
                    return {
                        ID: obj.ID.toString(),
                        Title: obj.Title,
                        Author: obj.Author[0],
                        Created: obj.Created ? new Date(obj.Created) : obj.Created
                    };
                }

            };

            /* CONSTRUCTORS */

            /* Data functions */

            var getTasks = function () {

                var deferred = $q.defer();

                var connectionInfo = {
                    request: {
                        method: "POST",
                        url: _spPageContextInfo.webAbsoluteUrl +
                        "/_api/web/lists/getbytitle('Tasks')/RenderListDataAsStream",
                        data: {
                            "parameters": {
                                "RenderOptions": 2,
                                "ViewXml": ""
                            }
                        },
                        headers: {
                            "Accept": "application/json; odata=nometadata"
                        }
                    },
                    ViewXml: {
                        ViewFields: "<ViewFields>" +
                        "<FieldRef Name='ID'/>" +
                        "<FieldRef Name='Title'/>" +
                        "<FieldRef Name='Author'/>" +
                        "<FieldRef Name='Created'/>" +
                        "</ViewFields>",
                        Query: "",
                        OrderBy: "<OrderBy><FieldRef Name='Created' Ascending='False'/></OrderBy>",
                        RowLimit: "<RowLimit>0</RowLimit>"
                    }
                };

                var request = connectionInfo.request;
                var ViewXml = connectionInfo.ViewXml;
                var queryFilter = "<Where></Where>";

                var newRequest = (JSON.parse(JSON.stringify(request)));
                newRequest.data.parameters.ViewXml = "<View>" +
                    ViewXml.ViewFields +
                    //		      "<Query>" +
                    //		      queryFilter +
                    //		      ViewXml.OrderBy +
                    //		      "</Query>" +
                    //		      ViewXml.RowLimit +
                    "</View>";


                var success = function (response) {

                    var orders = [];

                    angular.forEach(response.data.Row, function (obj, index) {
                        orders.push(new Task(obj));
                    });
                    deferred.resolve(orders);
                };

                var error = function (response) {
                    deferred.reject(response.data);
                };

                $http(newRequest).then(success, error);

                return deferred.promise;

            };

            /* Data functions */


            // Expose public functions
            return {

                // I/O
                getTasks: getTasks

            };

        }
    );

