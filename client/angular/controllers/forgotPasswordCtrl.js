myApp.controller('forgotPasswrdCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {

    $scope.forgotPass = function() {
      var user = {
        email: $scope.email
      }
      $http.post('http://localhost:3000/forgotPassword', user)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        $scope.message="*Please check your mail for instructions to reset the password";
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])

myApp.controller('resetPasswrdCtrl', ['$scope', '$http', '$location', '$routeParams',
  function($scope, $http, $location, $routeParams) {

    $scope.resetPass = function() {
      //console.log($route);
      var token = $routeParams.token;

      var user = {
        password: $scope.password
      }
      $http.post('http://localhost:3000/resetpasword/' + token, user)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        $scope.userId=response.data.user._id;
        $location.path('/dashboard/'+$scope.userId);
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])
