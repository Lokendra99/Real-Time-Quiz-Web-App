myApp.controller('deleteTestCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    console.log('here');
    $scope.deleteNote = 0;

    $http.get('http://localhost:3000/queries/deleteTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      if (response.data.ok === 1 && response.data.n === 1) {
        $scope.deleteNote = 1
      }
    //  alert('Deleted Successfully');

    }

    function errorCallback(response) {
      console.log(response);
    }

  }
])
