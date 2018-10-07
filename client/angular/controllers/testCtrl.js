
myApp.controller('testCtrl', ['$scope', '$http', '$routeParams', '$location','userclickedforReload',
  function($scope, $http, $routeParams, $location,userclickedforReload) {
    console.log('here');
    if (performance.navigation.type == 1) {
      console.info( "This page is reloaded" );
      alert('This page is reloaded,User cannot take exam');
        userclickedforReload.relaod=true;
        window.location.href='http://localhost:3000/#!/dashboard/'+$routeParams.userId;
    } else {
      console.info( "This page is not reloaded");
    }
    $scope.instructionPage = 1;
    $scope.questionsSection = 0;
    $scope.results = 0;



    $scope.answerByUser = [];
    $scope.choiceCheck = {
      setValue: null
    }
    $http.get('http://localhost:3000/queries/viewTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      $scope.testData = response.data.message;
      $scope.testId=$scope.testData._id;

    }

    function errorCallback(response) {
      console.log(response);
    }
    $scope.displayQuestions = function() {
      $scope.instructionPage = 0;
      $scope.questionsSection = 1;



      $scope.questions = $scope.testData.questions;
      $scope.totalQuestions = $scope.questions.length;
      console.log($scope.totalQuestions);
      $scope.singleQuestionData = $scope.questions[0];
      console.log($scope.questions);

    }
    $scope.startTimerFn = function() {
      console.log('timer started');
      socket.emit('startTimer', 0);
    }

    socket.on('timeRecordedForEachQuestion', function(timeForAns) {
      console.log('timeTaken ' + timeForAns.timeTaken);
    })


    socket.on('timer', function(data) {
      $scope.timecheck = data.countdown;
      $scope.$apply();
      console.log(data.countdown);
    })

    socket.on('stopTimer', function(arg) {
      $scope.timecheck = arg.countdown;
      $scope.$apply();
      console.log('timer stopped ' + arg.countdown);
      console.log('yaha aya');
      $scope.testIdForUser=$routeParams.id;
      console.log($scope.testIdForUser);

      $location.path('/result/'+$routeParams.userId+'/'+$scope.testIdForUser);
      $scope.questionsSection = 0;
      $scope.results = 1;
      // $location.path('/results')
      $scope.$apply();
    })
    $scope.stopTimerFromClient=function(){
      console.log('here stop');
      socket.emit('stopTimerWhenUserSubmits',{})
    }

    $scope.pop = function(question_id) {
      $scope.questionNo++;
      console.log($scope.choiceCheck.setValue);


      $scope.choiceCheck.setValue = null
      $scope.questions.shift();
      //console.log($scope.questions);
      $scope.displayQuestions();
    }


    $scope.timerForEachAnswer = function(questionId) {
      //console.log('$scope.timecheck '+$scope.timecheck);
      socket.emit('timeTakenToAnswerEachQuestionAndOtherDetails', {
        userId:$routeParams.userId,
        questionId:questionId,
        testId:$scope.testId,
        userOption:$scope.choiceCheck.setValue
      })
    }
    $scope.userId=$routeParams.userId;

    $scope.checkAnswer = function() {
      $scope.questionsSection = 0;

      console.log('$routeParams.userId '+$routeParams.userId);
      console.log('$scope.testId '+$scope.testId);

      $http.get('http://localhost:3000/queries/testResult/'+$routeParams.userId+'/'+$scope.testId)
      .then(successCallback, errorCallback);

        function successCallback(response){
          console.log(response);
        }
        function errorCallback(response){
          console.log(response);

        }
    }

  }
])
