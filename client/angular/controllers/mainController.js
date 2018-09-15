var myApp=angular.module('quiz',['ngRoute']);


myApp.controller('signUpCtrl',['$scope','$http','$location',function($scope,$http,$location){

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
        $location.path('/dashboard')
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


   $http.post('http://localhost:3000/security/login', loginData)
   .then(successCallback, errorCallback);

     function successCallback(response){
       console.log(response.data.data);
       console.log($scope.UserName=response.data.data.name);
       console.log($scope.email=response.data.data.email);
       if($scope.UserName=='TheAdmin' && $scope.email=='Admin99@outlook.com'){
         console.log('here it comes');
         $location.path('/admin/dashboard');
       }
       else{
         $location.path('/dashboard')
       }

     }
     function errorCallback(response){
       console.log(response);
       $location.path('/')
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

myApp.controller('adminDashboardCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){

    $scope.sentRequest=function(){

      var testData={
        title:$scope.title,
        testDescription:$scope.testDescription,
        timelimit:$scope.timelimit,
        difficulty:$scope.difficulty,
      }
      console.log(testData);
      $http.post('http://localhost:3000/queries/createTest', testData)
      .then(successCallback, errorCallback);

        function successCallback(response){
          console.log(response);
        }
        function errorCallback(response){
          console.log(response);

        }
    }

    $scope.getAllTests=function(){
      $http.get('http://localhost:3000/queries/viewAllTests/')
      .then(successCallback, errorCallback);

        function successCallback(response){
          console.log(response);
          $scope.tests=response.data.message;

        }
        function errorCallback(response){
          console.log(response);
        }
    }

}])

myApp.controller('adminTestCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){


      $http.get('http://localhost:3000/queries/viewTest/'+$routeParams.id)
      .then(successCallback, errorCallback);

        function successCallback(response){
          console.log(response);
          $scope.testData=response.data.message;
        }
        function errorCallback(response){
          console.log(response);
        }

}])



myApp.controller('deleteTestCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){
    console.log('here');
    $scope.deleteNote=0;

      $http.get('http://localhost:3000/queries/deleteTest/'+$routeParams.id)
      .then(successCallback, errorCallback);

        function successCallback(response){
          console.log(response);
          if(response.data.ok===1 && response.data.n===1){
            $scope.deleteNote=1
          }

        }
        function errorCallback(response){
          console.log(response);
        }

}])


myApp.controller('updateTestCtrl',['$scope','$http','$routeParams','$location',
  function($scope,$http,$routeParams,$location){
    console.log('here');


    $http.get('http://localhost:3000/queries/viewTest/'+$routeParams.id)
    .then(successCallback, errorCallback);

      function successCallback(response){
        //console.log(response);
        $scope.testData=response.data.message;
        console.log($scope.testData);
      }
      function errorCallback(response){
        console.log(response);
      }

      $scope.sentRequest=function(){

        var updatedTestData={
          title:$scope.title,
          testDescription:$scope.testDescription,
          timelimit:$scope.timelimit
        }

        $http.post('http://localhost:3000/queries/updateTest/'+$routeParams.id, updatedTestData)
        .then(successCallback, errorCallback);

          function successCallback(response){
            console.log(response);
            $location.path('/admin/dashboard')
          }
          function errorCallback(response){
            console.log(response);

          }
      }
}])
