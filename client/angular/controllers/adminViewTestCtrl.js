myApp.controller('adminViewTestsCtrl', ['$scope','$http', function($scope,$http) {

  $http.get('http://localhost:3000/queries/viewAllTests')
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log(response);
    $scope.numberOfTests = response.data.message
  }

  function errorCallback(response) {
    console.log(response);
  }
}])
