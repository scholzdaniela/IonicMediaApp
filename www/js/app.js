// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'pdf'])

.run(function ($ionicPlatform, $state, $rootScope, $localStorage, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        if (cordova.plugins.Keyboard.hideKeyboardAccessoryBar) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


      //check login
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {

        var loggedIn = $rootScope.globals.currentUser;
        if (toState.module === 'private' && !loggedIn) {
            // If logged out and transitioning to a logged in page:
            e.preventDefault();
            $state.go('login');
        }
    });

      // keep user logged in after page refresh
    $rootScope.globals = $localStorage.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['x-access-token'] = $rootScope.globals.currentUser.authToken; // jshint ignore:line
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $stateProvider

    //login page
      .state('login', {
          cache: false,
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginController'
      })

  // setup an abstract state for the tabs directive
  /*  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  */
    // setup an abstract state for mediadata 
    .state('mediadata', {
        cache: false,
        url: '/mediadata',
        abstract: true,
        templateUrl: 'templates/mediadata.html',
        controller: 'AppController'
    })


     // route for the home page -> mediadata overview
     .state('mediadata.overview', {
         cache: false,
                url: '/overview',
                views: {
                    
                    'content': {
                        templateUrl: 'templates/main.html',
                        controller: 'ProductController'
                    }
                },
                data: {
                    container_name: 'xxx',
                    filename: 'xxx',
                    title: 'xxx'
                },
                module: 'private'
             })


          // route for general information - technical information
            .state('mediadata.d8eac39824813f17c0916243e67b873f', {
                url: '/objects/documents/d8eac39824813f17c0916243e67b873f',
                views: {
                    'content': {
                        templateUrl: 'templates/pdf_view.html',
                        controller: 'DocCtrl'
                    }
                },
                data: {
                    container_name: 'another',
                    filename: 'Mediadaten-2016-Print_11',
                    title: 'Mediadaten'
                },
                module: 'private'
            })

    // route for 
            .state('mediadata.1eb304bbcd9cafb145b0f601b24ca392', {
                url: '/objects/documents/1eb304bbcd9cafb145b0f601b24ca392',
                views: {
                    'content': {
                        templateUrl: 'templates/pdf_view.html',
                        controller: 'DocCtrl'
                    }

                },
                data: {
                    container_name: 'another',
                    filename: 'Mediadaten-2016-Print_11',
                    title: 'Mediadaten'
                },
                module: 'private'
            })

			// route for 
            .state('mediadata.8ca1bf31aacc4ebcecf6c2e9c0c8c380', {
                url: '/objects/documents/8ca1bf31aacc4ebcecf6c2e9c0c8c380',
                views: {
                    'content': {
                        templateUrl: 'templates/pdf_view.html',
                        controller: 'DocCtrl'
                    }

                },
                data: {
                    container_name: 'another',
                    filename: 'Mediadaten-2016-Print_11',
                    title: 'Mediadaten'
                },
                module: 'private'
            })

     // route for the consultant pages

            
                .state('consultantarea', {
                    cache: false,
                    url: '/consultantarea',
                    abstract: true,
                    templateUrl: 'templates/consultantarea.html',
                    controller: 'AppController'
                })



            .state('consultantarea.overview', {
                cache: false,
                url: '/overview',
                views: {

                    'content': {
                        templateUrl: 'templates/consultant_main.html',
                        controller: 'ProductController'
                    }
                },
                data: {
                    container_name: 'xxx',
                    filename: 'xxx',
                    title: 'xxx'
                },
                module: 'private'
            })



			       
            .state('consultantarea.customer', {
                url: '/customer',
                views: {

                    'content': {
                        templateUrl: 'templates/list.html',
                        controller: 'ListController'
                    }


                },
                data: {
                    container_name: '',
                    filename: '',
                    title: 'Customers'
                },
                module: 'private'
            })

			.state('consultantarea.customer_new', {
			    url: '/customer_new',
			    views: {

			        'content': {
			            templateUrl: 'templates/new.html',
			            controller: 'AddController'
			        }


			    },
			    data: {
			        container_name: '',
			        filename: '',
			        title: 'Customers'
			    },
			    module: 'private'
			})

			       // route for the consultant pages
            .state('consultantarea.scribbles', {
                url: '/scribbles',
                views: {
                   
                    'content': {
                        templateUrl: 'templates/scribble.html',
                        controller: 'ScribbleListController'
                    }

                },
                data: {
                    container_name: '',
                    filename: '',
                    title: 'Scribbles'
                },
                module: 'private'
            })

			       // route for the consultant pages
            .state('consultantarea.notes', {
                url: '/notes',
                views: {
                    
                    'content': {
                        templateUrl: 'templates/list.html',
                        controller: 'ListController'
                    }

                },
                data: {
                    container_name: '',
                    filename: '',
                    title: 'Notes'
                },
                module: 'private'
            })

			.state('consultantarea.notes_new', {
			    url: '/notes_new',
			    views: {
			       
			        'content': {
			            templateUrl: 'templates/new.html',
			            controller: 'AddController'
			        }

			    },
			    data: {
			        container_name: '',
			        filename: '',
			        title: 'Notes'
			    },
			    module: 'private'
			})

			.state('consultantarea.editItem', {
			    url: '/editItem',
			    views: {
			        
			        'content': {
			            templateUrl: 'templates/edit.html',
			            controller: 'EditController'
			        }

			    },
			    data: {
			        container_name: '',
			        filename: '',
			        title: ''
			    },
			    params: {
			        title: null,
			        itemId: null
			    },
			    module: 'private'
			})

			  // route for the consultant pages
            .state('consultantarea.consultant_newscribble', {
                url: '/newscribble',

                views: {
                    'content': {
                        templateUrl: 'templates/newscribble.html',
                        controller: 'ScribbleController'
                    }
                },
                data: {
                    container_name: '',
                    filename: '',
                    title: 'New Scribble'
                },
                module: 'private'
            })



			        // route for the calculator pages

                // setup an abstract state for mediadata 
            .state('calculator', {
                cache: false,
                url: '/calculator',
                abstract: true,
                templateUrl: 'templates/calculator_main.html',
                controller: 'CalculatorController'
            })


            .state('calculator.overview', {
                url: '/overview',
                views: {
                    'content': {
                        templateUrl: 'templates/calculator.html',
                        controller: 'CalculatorController'
                    }
                },
                data: {
                    container_name: '',
                    filename: '',
                    title: 'Daily Newspapers',
                    id: '31957400b8a440db54a7d4061499d4f8'
                },
                module: 'private'
            })

			//calculator.03ddac54d3aeb880e919dbb7401bd9db
			.state('calculator.03ddac54d3aeb880e919dbb7401bd9db', {
			    url: '/03ddac54d3aeb880e919dbb7401bd9db',
			    views: {

			        'content': {
			            templateUrl: 'templates/calculator.html',
			            controller: 'CalculatorController'
			        }
			    },
			    data: {
			        container_name: '',
			        filename: '',
			        title: 'Weekly Newspapers',
			        id: '03ddac54d3aeb880e919dbb7401bd9db'
			    },
			    module: 'private'
			})

			//calculator.31957400b8a440db54a7d4061499d4f8
			.state('calculator.31957400b8a440db54a7d4061499d4f8', {
			    url: '/31957400b8a440db54a7d4061499d4f8',
			    views: {

			        'content': {
			            templateUrl: 'templates/calculator.html',
			            controller: 'CalculatorController'
			        }
			    },
			    data: {
			        container_name: '',
			        filename: '',
			        title: 'Daily Newspapers',
			        id: '31957400b8a440db54a7d4061499d4f8'
			    },
			    module: 'private'
			})






           // route for the home page -> mediadata overview
             .state('profil', {
                 url: '/',
                 abstract: true,
                 templateUrl: 'templates/userarea.html',
                 controller: 'ProfileController'
                
            })

            .state('profil.detail', {
                url: 'profile',
                views: {
                    
                    'content': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileController'
                    }

                },
                data: {
                    container_name: 'xxx',
                    filename: 'xxx',
                    title: 'Profile'
                },
                module: 'private'
            })


;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
