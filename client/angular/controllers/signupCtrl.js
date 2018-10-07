myApp.controller('SignupCtrl', ['$scope', '$location', '$auth','userDetails',
  function($scope, $location, $auth,userDetails) {
    console.log('coming here first');
    $scope.signup = function() {
      console.log('coming here');
      $auth.signup($scope.user)
        .then(function(response) {
          console.log(response);
          userDetails.user=response.data.user.username;
          $auth.setToken(response);
          $scope.userId=response.data.user._id;
          $location.path('/dashboard/'+$scope.userId);
          //toastr.info('You have successfully created a new account and have been signed-in');
          console.log('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          //toastr.error(response.data.message);
          console.log('response.data.message ' + response.data.message);
        });
    };
  }
]);
