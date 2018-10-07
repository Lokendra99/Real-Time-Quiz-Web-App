myApp.controller('performanceCtrlForAdmin', ['$scope','$routeParams','$http', function($scope,$routeParams,$http) {
  $scope.userTestDispDiv=false;
  console.log($routeParams.userId);

  $http.get('http://localhost:3000/queries/overAllPerformanceOfUser/'+$routeParams.userId)
    .then(successCallback, errorCallback);

  function successCallback(response) {
    console.log(response);
    $scope.testsPerformanceForUser = response.data.message
    $scope.getAverageReport($scope.testsPerformanceForUser);
  }

  function errorCallback(response) {
    console.log(response);
  }

  $scope.getAverageReport=function(userTestArray){

    $scope.totalTests=userTestArray.length;
    $scope.numberOfQuestionsInAllTests=$scope.totalTests*30;
    $scope.scoreOfAllTests=$scope.numberOfQuestionsInAllTests;
    $scope.timeofAlltests=$scope.numberOfQuestionsInAllTests;
    $scope.totalCorrectAns=null;
    $scope.totalWrongAns=null;
    $scope.totalScore=null;
    $scope.totalTime=null;




    userTestArray.forEach(function(test){
      $scope.totalCorrectAns=$scope.totalCorrectAns + test.testsAttempted[0].totalCorrectAnswers;
      $scope.totalWrongAns=$scope.totalWrongAns+test.testsAttempted[0].totalWrongAnswers;
      $scope.totalScore=$scope.totalScore+test.testsAttempted[0].score;
      $scope.totalTime=$scope.totalTime+test.testsAttempted[0].timeTaken;
    })

    var chart = AmCharts.makeChart( "chartdiv", {
  "type": "funnel",
  "theme": "light",
  "dataProvider": [ {
    "title": "Total Correct Answers User has given",
    "value": $scope.totalCorrectAns
  }, {
    "title": "Total Wrong Answers User has given",
    "value": $scope.totalWrongAns
  }, {
    "title": "Total Score of a User",
    "value": $scope.totalScore
  }, {
    "title": "Total Time User took",
    "value": $scope.totalTime
  }],
  "balloon": {
    "fixedPosition": true
  },
  "valueField": "value",
  "titleField": "title",
  "marginRight": 240,
  "marginLeft": 50,
  "startX": -500,
  "depth3D": 100,
  "angle": 40,
  "outlineAlpha": 1,
  "outlineColor": "#FFFFFF",
  "outlineThickness": 2,
  "labelPosition": "right",
  "balloonText": "[[title]]: [[value]]n[[description]]",
  "export": {
    "enabled": true
  }
} );
    console.log($scope.totalWrongAns);

  }

$scope.getUserTestSpecificDetails=function(testId){
  $scope.userTestDispDiv=true;
	 $http.get('http://localhost:3000/queries/testSpecificPerformanceForAdmin/'+$routeParams.userId+'/'+testId)
	    .then(successCallback, errorCallback);

	  function successCallback(response) {
	    console.log(response);
	    $scope.testSpecificPerformanceForUser = response.data;
	  }
	  function errorCallback(response) {
	    console.log(response);
	  }
}
}])
