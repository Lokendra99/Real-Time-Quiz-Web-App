myApp.controller('createTestCtrl', ['$scope', 'navbarDiv', '$http', '$location',
  function($scope, navbarDiv, $http, $location) {

    $scope.sentRequest = function() {

      var testData = {
        title: $scope.title,
        testDescription: $scope.testDescription,
        timelimit: $scope.timelimit,
        difficulty: $scope.difficulty,
        totalScore: $scope.totalScore
      }

      console.log(testData);
      $http.post('http://localhost:3000/queries/createTest', testData)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        $scope.id = response.data._id;
        $location.path('/adminTest/' + $scope.id)
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])
