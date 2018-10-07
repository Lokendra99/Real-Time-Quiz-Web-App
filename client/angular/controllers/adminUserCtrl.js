myApp.controller('adminUserCtrl', ['$scope','$http', function($scope,$http) {

  $http.get('http://localhost:3000/queries/viewAllUsers')
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log(response);
    $scope.numberOfUsers = response.data.message
  }

  function errorCallback(response) {
    console.log(response);
  }
}])
