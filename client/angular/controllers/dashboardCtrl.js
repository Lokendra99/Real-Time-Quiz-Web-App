myApp.controller('dashboardCtrl', ['$scope', '$http', '$location','$routeParams','$route','$window','userclickedforReload', function($scope, $http, $location,$routeParams,$route,$window,userclickedforReload) {



  $scope.$watch(function() {
    return userclickedforReload.relaod;
  }, function(newValue, oldValue) {
    console.log(newValue + ' ' + oldValue);
    if(newValue==true){
      userclickedforReload.relaod=false;
      $window.location.reload();
    }
    console.log();
    //$scope.navBarShow = navbarDiv.showNavBar;
  });

  $scope.userId=$routeParams.userId;
  console.log($scope.userId);
  $scope.userOptsForTestReport=0;



  $scope.testTakenByUser=function(testGivenByUsers){
    //console.log(testId);
    //console.log(testGivenByUsers);
    var checkPresent=false;

    testGivenByUsers.forEach(function(testGivenByUserId){
      if($routeParams.userId==testGivenByUserId){
          checkPresent=true;
          return false;
      }
    })
    if(checkPresent){
      return false;
    }
    else {
      return true;
    }
  }




  $scope.showChoices = 0
  $scope.showDescription = 0;
  $scope.userOptsForTest = 0;
  $scope.showTestLinks = 0;
  $scope.takeTestBtn = 0;


  $scope.userchoice = function() {
    $scope.showChoices = 1;
    $scope.userOptsForTest = 1;
    $scope.takeTestBtn = 1;
  }

  $scope.listOfNewTests = function(difficultyLevel) {
    $scope.showChoices = 0;
    $scope.showTestLinks = 1;
    $scope.difficultyLevel = difficultyLevel;

    $http.get('http://localhost:3000/queries/viewTestByDifficulty/' + difficultyLevel)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      $scope.numberOfTests = response.data.message

    }

    function errorCallback(response) {
      console.log(response);
    }
  }
}])
