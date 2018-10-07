myApp.controller('resultCtrl', ['$scope', '$http','$routeParams','$route','userclickedforReload',
function($scope, $http,$routeParams,$route,userclickedforReload) {

  $scope.userId=$routeParams.userId;
  console.log('test results');

  $scope.goDashboard=function(){
    userclickedforReload.relaod=true;
    console.log('reloading ho rahi hai');
    window.location.href='http://localhost:3000/#!/dashboard/'+$scope.userId;
  }
  //console.log(navbarDiv);

  console.log('$routeParams.userId '+$routeParams.userId);
  console.log('$scope.testId '+$routeParams.testId);

  $http.get('http://localhost:3000/queries/testResult/'+$routeParams.userId+'/'+$routeParams.testId)
  .then(successCallback, errorCallback);

    function successCallback(response){
      console.log(response);
      $scope.scoreCard=response.data.message;
      console.log($scope.scoreCard);
    }
    function errorCallback(response){
      console.log(response);

    }
}])
