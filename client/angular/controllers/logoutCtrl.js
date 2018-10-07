myApp.controller('LogoutCtrl', ['$location', '$auth', 'userDetails',function($location, $auth,userDetails) {
  if (!$auth.isAuthenticated()) {
    return;
  }
  $auth.logout()
    .then(function() {
      userDetails.user='User';
      console.log('You have been logged out');
      $location.path('/');
    });
}]);
