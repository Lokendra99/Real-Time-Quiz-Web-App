myApp.controller('LoginCtrl', ['$scope', '$location', '$auth','showUserLoggedIn','userDetails',
  function($scope, $location, $auth,showUserLoggedIn,userDetails) {

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          userDetails.user=response.data.user.username;

          //toastr.success('You have successfully signed in!');
          console.log('You have successfully signed in!');
          console.log(response);
          $scope.userId=response.data.user._id;
          //console.log($scope.email);

          if (response.data.user.username == 'admin890' && response.data.user.email == 'admin123@livequiz.com') {
            console.log('here it comes');
            $location.path('/admin/dashboard');
          } else {
            $location.path('/dashboard/'+$scope.userId);
          }
        })
        .catch(function(error) {
          //toastr.error(error.data.message, error.status);
          alert(error.data.message);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(result) {
          console.log(result);
          userDetails.user='Hello User';
          $scope.userId=result.data.user._id;
          //toastr.success('You have successfully signed in with ' + provider + '!');
          console.log('You have successfully signed in with ' + provider);
          $location.path('/dashboard/'+$scope.userId);
        })
        .catch(function(error) {
          if (error.message) {
            // Satellizer promise reject error.
            //toastr.error(error.message);
            alert('error.message ' + error.message);
          } else if (error.data) {
            // HTTP response error from server
            //toastr.error(error.data.message, error.status);
            alert('error.data.message ' + error.data.message);
          } else {
            //toastr.error(error);
          }
        });
    };
  }
]);
