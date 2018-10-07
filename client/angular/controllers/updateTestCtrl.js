myApp.controller('updateTestCtrl', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {
    console.log('here');


    $http.get('http://localhost:3000/queries/viewTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      //console.log(response);
      $scope.testData = response.data.message;
      console.log($scope.testData);
    }

    function errorCallback(response) {
      console.log(response);
    }

    $scope.sentRequest = function() {

      var updatedTestData = {
        title: $scope.title,
        testDescription: $scope.testDescription,
        timelimit: $scope.timelimit
      }

      $http.post('http://localhost:3000/queries/updateTest/' + $routeParams.id, updatedTestData)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        console.log(response);
        alert('Successfully updated')
        $location.path('/viewAllTests')
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])
