myApp.controller('userTestsCtrl', ['$scope', '$http', '$location','$routeParams', function($scope, $http, $location,$routeParams) {

  $scope.testTaken=function(){
    $scope.userOptsForTestReport=1;
    $http.get('http://localhost:3000/queries/performanceOfUser/'+$routeParams.userId)
    .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      var testsLength=response.data.message.length
      if(testsLength==0){
        $scope.noperformanceDiv=true;
        console.log(true);
      $scope.message={
        msg1:"Sorry,No test has been taken by you",
        msg2:"Take a test and come back again."
      }
      $scope.userId=$routeParams.userId;
    }
       else{
         $scope.noperformanceDiv=false;
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
          var testVal=i;
          console.log(temp[j]);
          var testDataToDisplay={
            Test:'test '+testVal,
            timeTaken:temp[j].timeTaken,
            color:'#FF0F00'
          }
          var testDataToDisplayCorrectAnswer={
            "test": "test "+testVal,
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
      "titles": [
        {
          "id": "Title-1",
          "size": 15,
          "text": "Time taken by User per test"
        }
      ],
      "dataProvider": arrForChat,
      "graphs": [{
          "balloonText": "[[category]]: <b>[[value]] seconds</b>",
          "colorField": "color",
          "fillAlphas": 0.85,
          "lineAlpha": 0.1,
          "type": "column",
          "topRadius":0.555,
          "valueField": "timeTaken"
      }],
      "valueAxes": [
        {
          "id": "ValueAxis-1",
          "stackType": "regular",
          "title": "Time taken Per Test in seconds"
        }
      ],
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
							"title": "Wrong Answers",
							"type": "column",
							"valueField": "wrongAnswer"
						},
						{
							"balloonText": "[[title]] of [[category]]:[[value]]",
							"fillAlphas": 1,
							"id": "AmGraph-2",
							"title": "Right Answers",
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
							"text": "Score of a User per test"
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
        "outlineAlpha": 0.4,
        "depth3D": 15,
        "labelRadius": 5,
        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        "angle": 30,
        "export": {
          "enabled": true
        }
} );
    }
}
  $scope.testTaken();

}])
