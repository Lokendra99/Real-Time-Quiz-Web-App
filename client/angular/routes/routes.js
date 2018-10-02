myApp.config(['$routeProvider','$authProvider',
function($routeProvider,$authProvider){



    var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }];


  $routeProvider
  .when('/',{
    templateUrl:'../views/home.html',
    //controller:'homeCtrl',

  })

  .when('/signUp',{
    templateUrl:'../views/signUpPage.html',
    controller:'SignupCtrl',

  })
  .when('/profile',{
    templateUrl:'../views/profile.html',
    controller:'ProfileCtrl',
    resolve: {
          loginRequired: loginRequired
        }
  })

  .when('/logout',{
    templateUrl:'../views/logout.html',
    controller:'LogoutCtrl',
    resolve: {
          loginRequired: loginRequired
        }
  })

  .when('/forgotPasswrd',{
    templateUrl:'../views/forgotPassword.html',
    controller:'forgotPasswrdCtrl'
  })
  .when('/reset/:token',{
    templateUrl:'../views/resetPassword.html',
    controller:'resetPasswrdCtrl'
  })

  .when('/admin/dashboard',{
    templateUrl:'../views/adminDashboard.html',
    controller:'adminDashboardCtrl'
  })
  .when('/login',{
    templateUrl:'../views/login.html',
    controller:'LoginCtrl'
  })
  .when('/result/:userId/:testId',{
    templateUrl:'../views/result.html',
    controller:'resultCtrl'
  })

  .when('/testsReportForUser/:userId',{
    templateUrl:'../views/testsReportForUser.html',
    controller:'userTestsCtrl'
  })
  .when('/dashboard/:userId',{
    templateUrl:'../views/dashboard.html',
    controller:'dashboardCtrl',
    resolve: {
          loginRequired: loginRequired
        }
  })
  .when('/createTest',{
    templateUrl:'../views/createTest.html',
    controller:'createTestCtrl'
  })

  .when('/createQuestion',{
    templateUrl:'../views/createQuestion.html',
    controller:'createQuestionCtrl'
  })
  .when('/test/:userId/:id',{
    templateUrl:'../views/test.html',
    controller:'testCtrl'
  })
     .when('/allQuestions',{
    templateUrl:'../views/questionsList.html',
    controller:'questionsByAdminCtrl'
  })

  .when('/results',{
    templateUrl:'../views/result.html',
    controller:'testCtrl'
  })
    .when('/createTest',{
    templateUrl:'../views/createTest.html',
    controller:'createTestCtrl'
  })

  .when('/adminTest/:id',{
    templateUrl:'../views/adminTest.html',
    controller:'adminTestCtrl'
  })
  .when('/viewUsers',{
    templateUrl:'../views/usersList.html',
    controller:'adminUserCtrl'

  })

  .when('/viewAllTests',{
    templateUrl:'../views/AllTests.html',
    controller:'adminViewTestsCtrl'
  })

  .when('/viewAllQuestions/:id',{
    templateUrl:'../views/AllQuestions.html',
    controller:'adminViewQuestionsCtrl'
  })
  .when('/updateTest/:id',{
    templateUrl:'../views/updateTest.html',
    controller:'updateTestCtrl'
  })
  .when('/deleteTest/:id',{
    templateUrl:'../views/delete.html',
    controller:'deleteTestCtrl'
  })



  $authProvider.google({
      url: '/auth/google',
      clientId: '173402901503-bttuemk945u2citejq1pr6rmqg410ak9.apps.googleusercontent.com',
      redirectUri: 'http://localhost:3000/queries/googleDashboard'
  });
    $authProvider.facebook({
        url: '/auth/facebook',
        clientId: '193184427903099',
        redirectUri: 'http://localhost:3000/facebook/dashboard',
        //popupOptions: { width: 900, height: 700 }
      });
}])
console.log('wdwed');
