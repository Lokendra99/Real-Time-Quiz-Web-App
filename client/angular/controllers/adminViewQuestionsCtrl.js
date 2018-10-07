myApp.controller('adminViewQuestionsCtrl', ['$scope','$http','$routeParams','$location',
function($scope,$http,$routeParams,$location) {
  console.log('here');

  $http.get('http://localhost:3000/queries/viewAllQuestionsByAdmin')
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log('here also');
    console.log(response);
    $scope.numberOfQuestions = response.data.message
  }
  console.log('checkVal'+$scope.checkVal);

  function errorCallback(response) {
    console.log(response);
  }
  $scope.deleteQuestion=function(questionId){
    console.log('delete');
    $http.get('http://localhost:3000/queries/deleteQuestion/'+questionId)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log('deleted');
      $scope.deleteMsg="Question deleted"
      alert($scope.deleteMsg);
      $location.path('/viewAllQuestions/all');


    }
    function errorCallback(response) {
      console.log(response);
    }
  }
}])
