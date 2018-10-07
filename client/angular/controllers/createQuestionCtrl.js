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
