myApp.controller('updateQuestionCtrl', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {
    console.log('here');


    $http.get('http://localhost:3000/queries/viewQuestion/' + $routeParams.id)
      .then(successCallback, errorCallback);

    function successCallback(response) {
      console.log(response);
      $scope.questionData = response.data[0];
      console.log($scope.questionData);
    }

    function errorCallback(response) {
      console.log(response);
    }

    $scope.sentRequest = function() {

      var updatedQuestionData = {
        question: $scope.question,
        options: $scope.options,
        category: $scope.category,
        difficulty: $scope.difficulty,
        answer:$scope.answer
      }

      $http.post('http://localhost:3000/queries/updateQuestion/' + $routeParams.id, updatedQuestionData)
        .then(successCallback, errorCallback);

      function successCallback(response) {
        console.log(response);
        alert('successfully updated')
        $location.path('/viewAllQuestions/all')
      }

      function errorCallback(response) {
        console.log(response);

      }
    }
  }
])
