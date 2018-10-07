myApp.controller('adminTestCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {


    $http.get('http://localhost:3000/queries/viewTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      $scope.testData = response.data.message;
    }

    function errorCallback(response) {
      console.log(response);
    }

  }
])
