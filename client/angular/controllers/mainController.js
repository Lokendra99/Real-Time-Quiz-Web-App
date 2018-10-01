var myApp=angular.module('quiz',['ngRoute','satellizer']);

var socket=io();



socket.on('connect',function(){
  console.log('sockets in controller file');
})

myApp.controller('ProfileCtrl', function($scope, $auth, Account){
    //$scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
          console.log(response);
        })
        .catch(function(response) {
          console.log(response.data.message, response.status);
        });
    //};
  });

myApp.controller('createTestCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){

    $scope.sentRequest=function(){

      var questionData={
        question:$scope.question,
        adminOptions:$scope.adminOptions,
        category:$scope.category,
        difficulty:$scope.difficulty,
      }
      console.log(questionData);
      $http.post('http://localhost:3000/queries/createQuestion', questionData)
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


myApp.controller('SignupCtrl',['$scope','$location','$auth',
function($scope,$location,$auth){
  console.log('coming here first');
    $scope.signup = function() {
      console.log('coming here');
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/dashboard');
          //toastr.info('You have successfully created a new account and have been signed-in');
          console.log('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          //toastr.error(response.data.message);
          console.log('response.data.message '+response.data.message);
        });
    };
  }]);

 // $scope.sentRequest=function(){
 //
 //   var userSignUpData={
 //    // name:$scope.userName,
 //     email:$scope.userEmail,
 //     //mobileNum:$scope.userMobilenumber,
 //     password:$scope.userPassword
 //   }
 //
 //   console.log(userSignUpData);
 //
 //   $http.post('http://localhost:3000/security/signup', userSignUpData)
 //   .then(successCallback, errorCallback);
 //
 //     function successCallback(response){
 //       console.log(response);
 //        $location.path('/dashboard')
 //     }
 //     function errorCallback(response){
 //       console.log(response);
 //     }
 // }
//}])

myApp.controller('LoginCtrl',['$scope','$location','$auth',
function($scope,$location,$auth){

   $scope.login = function() {
     $auth.login($scope.user)
       .then(function() {
         //toastr.success('You have successfully signed in!');
         console.log('You have successfully signed in!');
         $location.path('/dashboard');
       })
       .catch(function(error) {
         //toastr.error(error.data.message, error.status);
         console.log(error);
       });
   };
   $scope.authenticate = function(provider) {
     $auth.authenticate(provider)
       .then(function() {
         //toastr.success('You have successfully signed in with ' + provider + '!');
         console.log('You have successfully signed in with '+provider);
         $location.path('/');
       })
       .catch(function(error) {
         if (error.message) {
           // Satellizer promise reject error.
           //toastr.error(error.message);
           console.log('error.message '+error.message);
         } else if (error.data) {
           // HTTP response error from server
           //toastr.error(error.data.message, error.status);
           console.log('error.data.message '+error.data.message);
         } else {
           //toastr.error(error);
         }
       });
   };
 }]);

 // $scope.sentRequest=function(){
 //
 //   var loginData={
 //     email:$scope.userEmail,
 //     pass:$scope.userPassword
 //   }
 //
 //
 //   $http.post('http://localhost:3000/security/login', loginData)
 //   .then(successCallback, errorCallback);
 //
 //     function successCallback(response){
 //       console.log(response.data.data);
 //       console.log($scope.UserName=response.data.data.name);
 //       console.log($scope.email=response.data.data.email);
 //       if($scope.UserName=='TheAdmin' && $scope.email=='Admin99@outlook.com'){
 //         console.log('here it comes');
 //         $location.path('/admin/dashboard');
 //       }
 //       else{
 //         $location.path('/dashboard')
 //       }
 //
 //     }
 //     function errorCallback(response){
 //       console.log(response);
 //       $location.path('/')
 //     }
 // }
//}])
myApp.controller('LogoutCtrl', ['$location', '$auth',function($location, $auth) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        console.log('You have been logged out');
        $location.path('/');
      });
  }]);

myApp.controller('dashboardCtrl',['$scope','$http','$location',function($scope,$http,$location){


  $scope.showChoices=0
  $scope.showDescription=0


  $scope.userchoice=function(){
    $scope.showChoices=1;
  }

 $scope.listOfNewTests=function(difficultyLevel){

   $http.get('http://localhost:3000/queries/viewTestByDifficulty/'+difficultyLevel)
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

myApp.controller('questionsByAdminCtrl',['$scope','$http','$location',function($scope,$http,$location){


 $scope.listOfAllQuestions=function(){

   $http.get('http://localhost:3000/queries/viewAllQuestionsByAdmin')
   .then(successCallback, errorCallback);

     function successCallback(response){
       console.log(response);
       $scope.numberOfquestions=response.data.message

     }
     function errorCallback(response){
       console.log(response);
     }
 }
}])


myApp.controller('testCtrl',['$scope','$http','$routeParams','$location',
function($scope,$http,$routeParams,$location){

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
    $scope.startTimerFn=function(){
      console.log('timer started');
      socket.emit('startTimer',0);
    }

    socket.on('timeRecordedForEachQuestion',function(timeForAns){
      console.log('timeTaken '+ timeForAns.timeTaken);
    })


    socket.on('timer',function(data){
      $scope.timecheck=data.countdown;
      $scope.$apply();
      console.log(data.countdown);
    })

      socket.on('stopTimer',function(arg){
      $scope.timecheck=arg.countdown;
      $scope.$apply();
      console.log('timer stopped '+arg.countdown);
      //$location.path('/results')
    //  $scope.$apply();
    })

    $scope.pop=function(question_id){
      console.log($scope.choiceCheck.setValue);
      $scope.answerByUser.push({
        questionId:question_id,
        correctOption:$scope.choiceCheck.setValue
      })
      console.log($scope.answerByUser);

      $scope.choiceCheck.setValue=null
      $scope.questions.shift();
      console.log($scope.questions);
      $scope.displayQuestions();
    }


    $scope.timerForEachAnswer=function(){
      //console.log('$scope.timecheck '+$scope.timecheck);
      socket.emit('timeTakenToAnswerEachQuestion',{})
    }

    $scope.checkAnswer=function(){

      var answerArr=$scope.answerByUser;
      console.log(answerArr);

      $http.post('http://localhost:3000/queries/checkAnswer/'+$routeParams.id, answerArr)
      .then(successCallback, errorCallback);

        function successCallback(response){
          console.log(response);
        }
        function errorCallback(response){
          console.log(response);

        }
    }


  //  console.log($scope.selectedOption);
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


myApp.controller('resultCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){


}])
