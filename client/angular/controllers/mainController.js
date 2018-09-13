var myApp=angular.module('quiz',['ngRoute']);


myApp.controller('signUpCtrl',['$scope','$http',function($scope,$http){

 $scope.sentRequest=function(){

   var userSignUpData={
     name:$scope.userName,
     email:$scope.userEmail,
     mobileNum:$scope.userMobilenumber,
     pass:$scope.userPassword
   }

   console.log(userSignUpData);
   $http.post('http://localhost:3000/security/signup', userSignUpData)
   .then(successCallback, errorCallback);

     function successCallback(response){
       console.log(response);
     }
     function errorCallback(response){
       console.log(response);
     }
 }
}])

myApp.controller('loginCtrl',['$scope','$http','$location',function($scope,$http,$location){

 $scope.sentRequest=function(){

   var loginData={
     email:$scope.userEmail,
     pass:$scope.userPassword
   }

   console.log(loginData);
   $http.post('http://localhost:3000/security/login', loginData)
   .then(successCallback, errorCallback);

     function successCallback(response){
       console.log(response);
       $location.path('/dashboard')
     }
     function errorCallback(response){
       console.log(response);
     }
 }
}])

myApp.controller('dashboardCtrl',['$scope','$http','$location',function($scope,$http,$location){

  $scope.showChoices=0
  $scope.showDescription=0


  $scope.userchoice=function(){
    $scope.showChoices=1;
  }

 $scope.listOfNewTests=function(category){

   $http.get('http://localhost:3000/queries/viewTestByCategory/'+category)
   .then(successCallback, errorCallback);

     function successCallback(response){
       console.log(response);
       $scope.numberOfTests=response.data.message

     }
     function errorCallback(response){
       console.log(response);
     }
 }
}])

myApp.controller('testCtrl',['$scope','$http','$routeParams',function($scope,$http,$routeParams){

  $scope.answerByUser=[];
  $scope.choiceCheck={
    setValue:null
  }
  $http.get('http://localhost:3000/queries/viewTest/'+$routeParams.id)
  .then(successCallback, errorCallback);

    function successCallback(response){
      console.log(response);
      $scope.testData=response.data.message

    }
    function errorCallback(response){
      console.log(response);
    }
    $scope.displayQuestions=function(){
      $scope.questions=$scope.testData.questions;

      $scope.singleQuestionData=$scope.questions[0];
      console.log($scope.questions);

    }


    $scope.pop=function(){
      console.log($scope.choiceCheck.setValue);
      $scope.answerByUser.push($scope.choiceCheck.setValue)
      console.log($scope.answerByUser);

      $scope.choiceCheck.setValue=null
      $scope.questions.shift();
      console.log($scope.questions);
      $scope.displayQuestions();


    }
    console.log($scope.selectedOption);
}])

// myApp.controller('questionCtrl',['$scope','$http','$routeParams',function($scope,$http,$routeParams){
//   $http.get('http://localhost:3000/queries/viewTestQuestions/'+$routeParams.id)
//   .then(successCallback, errorCallback);
//
//     function successCallback(response){
//       console.log(response);
//       $scope.questionData=response.data.message
//
//     }
//
//     function errorCallback(response){
//       console.log(response);
//     }
//
// }])
