myApp.controller('indexCtrl', ['$scope', 'navbarDiv','showUserLoggedIn','userDetails','$auth', function($scope, navbarDiv,showUserLoggedIn,userDetails,$auth) {
  //
  //$scope.userPresentName=null;
  console.log('come here');

  console.log($auth.isAuthenticated());

  $scope.$watch(function(){
    if($auth.isAuthenticated()){
      return true;
    }else{
      $scope.userLogged=true;
      return false;
    }
  },
  function(newValue,oldValue){
    console.log(newValue,oldValue);
    if(newValue==true){

    }
  }
)

  console.log(navbarDiv);

  $scope.navBarShow = navbarDiv.showNavBar;

  $scope.$watch(function() {
    return navbarDiv.showNavBar;
  }, function(newValue, oldValue) {
    console.log(newValue + ' ' + oldValue);
    console.log(navbarDiv.showNavBar);
    $scope.navBarShow = navbarDiv.showNavBar;
  });

  var authcheck=$auth.isAuthenticated();
  console.log(authcheck);
  if(authcheck==false){

  }
  $scope.$watch(function() {
    return userDetails.user;
  }, function(newValue, oldValue) {
    console.log(newValue + ' ' + oldValue);
    if(newValue!=null){
      $scope.userLogged=false;
      $scope.userPresentName=newValue;
    }
    else if(newValue==null && authcheck==false){
      console.log('yes');
      $scope.userLogged=true;
      $scope.userPresentName=null;
    }
  });

}])
