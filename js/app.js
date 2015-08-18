// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput','ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
    $ionicPlatform.ready(function() {														
		
		//ABILITIAMO L'APP AL FUNZIONAMENTO IN BACKGROUND
				
		// Enable background mode		
		cordova.plugins.backgroundMode.configure({ silent: true });
		cordova.plugins.backgroundMode.enable();
		
		cordova.plugins.backgroundMode.onactivate = function() {			
			
			cordova.plugins.backgroundMode.configure({ silent: true });
			
			 var delayedUpdate = function() {
                $timeout(function() {                   
					
					//preleviamo l'ultimo post da FB
					ngFB.init({appId: '1613110712292812', accessToken: '1613110712292812|k9j4h1sAQDpNCwcuZXKp_I1SKu8'});
					
					var lastId = new Object();
					
					ngFB.api({
						method: 'GET',
						path: '/150117738356335/posts/',
						params: {
							fields: 'id,message'
							,limit: '1'						
						}	
					}).then(
						function(posts) { 				
							lastId = posts.data[0].id;
							lastMsg = posts.data[0].message;							
							
							//Notifichiamo che c'è un nuovo post
							
							if (lastId != window.localStorage.getItem('LASTPOSTID') ) {
								window.localStorage.setItem('LASTPOSTID',lastId);
							
								cordova.plugins.notification.local.schedule({
									id: 1,
									title: "Ci sono novità alla Jumping!",
									text: lastMsg							
								});
							}
					});
					
					//Richiamiamo la funzione ciclimamente ogni 30 minuti
                    delayedUpdate();
                }, 30*60*1000);
            };
					
		};		
		
								
		navigator.splashscreen.hide();	
		
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
		
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);
	
    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    
	*/		
	
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-positive-900 flap"><i class="icon ion-clipboard"></i></button>',
				//template: '',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-positive-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-positive-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-positive-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/activity');
});
