myApp.controller('adminDashboardCtrl', ['$scope', '$http', '$routeParams', 'navbarDiv','$route',
  function($scope, $http, $routeParams, navbarDiv,$route) {

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
