var myApp = angular.module('quiz', ['ngRoute', 'satellizer']);

var socket = io();



socket.on('connect', function() {
  console.log('sockets in controller file');
})

<<<<<<< HEAD
myApp.controller('ProfileCtrl', function($scope, $auth, Account) {
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

myApp.controller('SignupCtrl', ['$scope', '$location', '$auth',
  function($scope, $location, $auth) {
    console.log('coming here first');
=======
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
>>>>>>> b5981e83bc2a97d4a4a28c1275dc8cabd84f99dc
    $scope.signup = function() {
      console.log('coming here');
      $auth.signup($scope.user)
        .then(function(response) {
          console.log(response);
          $auth.setToken(response);
          $scope.userId=response.data.user._id;
          $location.path('/dashboard/'+$scope.userId);
          //toastr.info('You have successfully created a new account and have been signed-in');
          console.log('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          //toastr.error(response.data.message);
          console.log('response.data.message ' + response.data.message);
        });
    };
  }
]);



myApp.controller('LoginCtrl', ['$scope', '$location', '$auth',
  function($scope, $location, $auth) {

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
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
          console.log(error);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          //toastr.success('You have successfully signed in with ' + provider + '!');
          console.log('You have successfully signed in with ' + provider);
          $location.path('/');
        })
        .catch(function(error) {
          if (error.message) {
            // Satellizer promise reject error.
            //toastr.error(error.message);
            console.log('error.message ' + error.message);
          } else if (error.data) {
            // HTTP response error from server
            //toastr.error(error.data.message, error.status);
            console.log('error.data.message ' + error.data.message);
          } else {
            //toastr.error(error);
          }
        });
    };
  }
]);

myApp.controller('LogoutCtrl', ['$location', '$auth', function($location, $auth) {
  if (!$auth.isAuthenticated()) {
    return;
  }
  $auth.logout()
    .then(function() {
      console.log('You have been logged out');
      $location.path('/');
    });
}]);

myApp.controller('forgotPasswrdCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {

    $scope.forgotPass = function() {
      var user = {
        email: $scope.email
      }
      $http.post('http://localhost:3000/forgotPassword', user)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])

myApp.controller('resetPasswrdCtrl', ['$scope', '$http', '$location', '$routeParams',
  function($scope, $http, $location, $routeParams) {

    $scope.resetPass = function() {
      //console.log($route);
      var token = $routeParams.token;

      var user = {
        password: $scope.password
      }
      $http.post('http://localhost:3000/resetpasword/' + token, user)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])

myApp.controller('userTestsCtrl', ['$scope', '$http', '$location','$routeParams', function($scope, $http, $location,$routeParams) {

  $scope.testTaken=function(){
    $scope.userOptsForTestReport=1;
    $http.get('http://localhost:3000/queries/performanceOfUser/'+$routeParams.userId)
    .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      var arrForChat=[];
      var arrForChartToAnswer=[];
      var totalCorrectAnswersInAllTests=0;
      var totalWrongAnswersInAllTests=0;
      var pieChartData=[];


      $scope.performanceOfTests = response.data.message;
      for(var i in $scope.performanceOfTests){
        console.log($scope.performanceOfTests[i]);
        for( var j in $scope.performanceOfTests[i]['testsAttempted']){
          var temp=$scope.performanceOfTests[i]['testsAttempted'];
          console.log(temp[j]);
          var testDataToDisplay={
            Test:'test',
            timeTaken:temp[j].timeTaken,
            color:'#FF0F00'
          }
          var testDataToDisplayCorrectAnswer={
            "test": "test",
            "wrongAnswer":temp[j].totalWrongAnswers,
            "rightAnswer":temp[j].totalCorrectAnswers
          }
          totalCorrectAnswersInAllTests=totalCorrectAnswersInAllTests+temp[j].totalCorrectAnswers;
          totalWrongAnswersInAllTests=totalWrongAnswersInAllTests+
          temp[j].totalWrongAnswers;
          arrForChat.push(testDataToDisplay);
          arrForChartToAnswer.push(testDataToDisplayCorrectAnswer)

        }
      }
      var tempObj1={
        'title':'Total Correct Answers in all Tests',
        'value':totalCorrectAnswersInAllTests
      }
      var tempObj2={
        'title':'Total Wrong Answers in all Tests',
        'value':totalWrongAnswersInAllTests
      }
      pieChartData.push(tempObj1);
      pieChartData.push(tempObj2);
      pieChart(pieChartData);

      chartDataToDisplay(arrForChat);
      chartForDisplayCorrectVsIncorrect(arrForChartToAnswer);

    }

    function errorCallback(response) {
      console.log(response);
    }

    var chartDataToDisplay=function(arrForChat){
      console.log(arrForChat);
      var chart = AmCharts.makeChart("chartdiv", {
      "theme": "light",
      "type": "serial",
      "startDuration": 2,
      "dataProvider": arrForChat,
      "graphs": [{
          "balloonText": "[[category]]: <b>[[value]]</b>",
          "colorField": "color",
          "fillAlphas": 0.85,
          "lineAlpha": 0.1,
          "type": "column",
          "topRadius":0.555,
          "valueField": "timeTaken"
      }],
      "depth3D": 17,
    "angle": 33.82,
      "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
      },
      "categoryField": "Test",
      "categoryAxis": {
          "gridPosition": "start",
          "axisAlpha":0,
          "gridAlpha":0

      },
      "export": {
        "enabled": true
       }

  }, 0);
    }

    chartForDisplayCorrectVsIncorrect=function(arrForChartToAnswer){
      console.log(arrForChartToAnswer);
      AmCharts.makeChart("chartdiv2",
				{
					"type": "serial",
					"categoryField": "test",
					"angle": 30,
					"depth3D": 30,
					"startDuration": 1,
					"categoryAxis": {
						"gridPosition": "start"
					},
					"trendLines": [],
					"graphs": [
						{
							"balloonText": "[[title]] of [[category]]:[[value]]",
							"fillAlphas": 1,
							"id": "AmGraph-1",
							"title": "graph 1",
							"type": "column",
							"valueField": "wrongAnswer"
						},
						{
							"balloonText": "[[title]] of [[category]]:[[value]]",
							"fillAlphas": 1,
							"id": "AmGraph-2",
							"title": "graph 2",
							"type": "column",
							"valueField": "rightAnswer"
						}
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"stackType": "regular",
							"title": "Score Per Test"
						}
					],
					"allLabels": [],
					"balloon": {},
					"legend": {
						"enabled": true,
						"useGraphSettings": true
					},
					"titles": [
						{
							"id": "Title-1",
							"size": 15,
							"text": "Chart Title"
						}
					],
					"dataProvider": arrForChartToAnswer
				}
			);
    }
    pieChart=function(pieChartData){
      console.log(pieChartData);
      var chart = AmCharts.makeChart( "chartdiv3", {
        "type": "pie",
        "theme": "light",
        "dataProvider": pieChartData,
        "titleField": "title",
        "valueField": "value",
        "labelRadius": 5,

        "radius": "42%",
        "innerRadius": "60%",
        "labelText": "[[title]]",
        "export": {
          "enabled": true
        }
} );
    }
}
  $scope.testTaken();

}])

<<<<<<< HEAD
myApp.controller('dashboardCtrl', ['$scope', '$http', '$location','$routeParams', function($scope, $http, $location,$routeParams) {

  $scope.userId=$routeParams.userId;
  console.log($scope.userId);
  $scope.userOptsForTestReport=0;

=======
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
>>>>>>> b5981e83bc2a97d4a4a28c1275dc8cabd84f99dc


  $scope.testTakenByUser=function(testGivenByUsers){
    //console.log(testId);
    console.log(testGivenByUsers);
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

myApp.controller('adminViewTestsCtrl', ['$scope','$http', function($scope,$http) {

  $http.get('http://localhost:3000/queries/viewAllTests')
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log(response);
    $scope.numberOfTests = response.data.message
  }

  function errorCallback(response) {
    console.log(response);
  }
}])
	
myApp.controller('performanceCtrlForAdmin', ['$scope','$routeParams','$http', function($scope,$routeParams,$http) {

  $http.get('http://localhost:3000/queries/overAllPerformanceOfUser/'+$routeParams.userId)
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log(response);
    $scope.testsPerformanceForUser = response.data.message
  }

  function errorCallback(response) {
    console.log(response);
  }
$scope.getUserTestSpecificDetails=function(testId){
	 $http.get('http://localhost:3000/queries/testSpecificPerformanceForAdmin/'+$routeParams.userId+'/'+testId)
	    .then(successCallback, errorCallback);

	  function successCallback(response) {
	    console.log(response);
	    $scope.testSpecificPerformanceForUser = response.data.message
	  }

	  function errorCallback(response) {
	    console.log(response);
	  }	
}
}])

myApp.controller('adminViewQuestionsCtrl', ['$scope','$http','$routeParams',
function($scope,$http,$routeParams) {
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
}])

myApp.controller('adminUserCtrl', ['$scope','$http', function($scope,$http) {

  $http.get('http://localhost:3000/queries/viewAllUsers')
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log(response);
    $scope.numberOfUsers = response.data.message
  }

  function errorCallback(response) {
    console.log(response);
  }
}])

myApp.controller('testCtrl', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {
    console.log('here');


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
      $scope.questionsSection = 0;
      $scope.results = 1;
      // $location.path('/results')
      $scope.$apply();
    })

    $scope.pop = function(question_id) {
      $scope.questionNo++;
      console.log($scope.choiceCheck.setValue);
      $scope.answerByUser.push({
        questionId: question_id,
        correctOption: $scope.choiceCheck.setValue
      })
      console.log($scope.answerByUser);

      $scope.choiceCheck.setValue = null
      $scope.questions.shift();
      console.log($scope.questions);
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
      //$scope.results = 1;
      //console.log($scope.results);
      //console.log($scope.username);


      //var answerArr = $scope.answerByUser;
      //console.log(answerArr);


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


    //  console.log($scope.selectedOption);
  }
])
myApp.factory('navbarDiv', function() {
  return {
    showNavBar: 1
  }
})

myApp.controller('indexCtrl', ['$scope', 'navbarDiv', function($scope, navbarDiv) {
  console.log(navbarDiv);

  $scope.navBarShow = navbarDiv.showNavBar;

  $scope.$watch(function() {
    return navbarDiv.showNavBar;
  }, function(newValue, oldValue) {
    console.log(newValue + ' ' + oldValue);
    console.log(navbarDiv.showNavBar);
    $scope.navBarShow = navbarDiv.showNavBar;
  });
}])

myApp.controller('resultCtrl', ['$scope', '$http','$routeParams',
function($scope, $http,$routeParams) {
  console.log('test results');
  //console.log(navbarDiv);

  console.log('$routeParams.userId '+$routeParams.userId);
  console.log('$scope.testId '+$routeParams.testId);

  $http.get('http://localhost:3000/queries/testResult/'+$routeParams.userId+'/'+$routeParams.testId)
  .then(successCallback, errorCallback);

    function successCallback(response){
      console.log(response);
    }
    function errorCallback(response){
      console.log(response);

    }
}])
myApp.controller('createTestCtrl', ['$scope', 'navbarDiv', '$http', '$location',
  function($scope, navbarDiv, $http, $location) {

    $scope.sentRequest = function() {

      var testData = {
        title: $scope.title,
        testDescription: $scope.testDescription,
        timelimit: $scope.timelimit,
        difficulty: $scope.difficulty,
        totalScore: $scope.totalScore
      }

      console.log(testData);
      $http.post('http://localhost:3000/queries/createTest', testData)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        $scope.id = response.data._id;
        $location.path('/adminTest/' + $scope.id)
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])
myApp.controller('createQuestionCtrl', ['$scope', 'navbarDiv', '$http', '$location',
  function($scope, navbarDiv, $http, $location) {

    $scope.sentRequest = function() {

      var questionData = {
        question: $scope.question,
        options: $scope.options,
        category: $scope.category,
        difficulty: $scope.difficulty,
        answer:$scope.answer
      }

      console.log(questionData);
      $http.post('http://localhost:3000/queries/createQuestion', questionData)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        $scope.id = response.data.message._id;
        $location.path('/viewAllQuestions/' + $scope.id)
        console.log(response);
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])

myApp.controller('adminDashboardCtrl', ['$scope', '$http', '$routeParams', 'navbarDiv',
  function($scope, $http, $routeParams, navbarDiv) {
    console.log(navbarDiv);
    navbarDiv.showNavBar = 0;
    console.log(navbarDiv);

    $scope.openNav = function() {
      document.getElementById("mySidenav").style.width = "250px";
    }

    $scope.closeNav = function() {
      document.getElementById("mySidenav").style.width = "0";
    }



    $scope.getAllTests = function() {
      $http.get('http://localhost:3000/queries/viewAllTests/')
        .then(successCallback, errorCallback);

      function successCallback(response) {
        console.log(response);
        $scope.tests = response.data.message;

      }

      function errorCallback(response) {
        console.log(response);
      }
    }

  }
])

myApp.controller('adminTestCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {


    $http.get('http://localhost:3000/queries/viewTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      $scope.testData = response.data.message;
    }

    function errorCallback(response) {
      console.log(response);
    }

  }
])



myApp.controller('deleteTestCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    console.log('here');
    $scope.deleteNote = 0;

    $http.get('http://localhost:3000/queries/deleteTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      if (response.data.ok === 1 && response.data.n === 1) {
        $scope.deleteNote = 1
      }

    }

    function errorCallback(response) {
      console.log(response);
    }

  }
])


myApp.controller('updateTestCtrl', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {
    console.log('here');


    $http.get('http://localhost:3000/queries/viewTest/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      //console.log(response);
      $scope.testData = response.data.message;
      console.log($scope.testData);
    }

    function errorCallback(response) {
      console.log(response);
    }

    $scope.sentRequest = function() {

      var updatedTestData = {
        title: $scope.title,
        testDescription: $scope.testDescription,
        timelimit: $scope.timelimit
      }

      $http.post('http://localhost:3000/queries/updateTest/' + $routeParams.id, updatedTestData)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        console.log(response);
        $location.path('/admin/dashboard')
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])
