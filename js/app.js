// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput','ngOpenFB', 'ngCordova'])

.run(function($ionicPlatform, ngFB, $timeout, backgrdNotification, $rootScope, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaSplashscreen, $cordovaNetwork) {
	
	$ionicPlatform.APPFBID = '1613110712292812';
	$ionicPlatform.STATICTOKEN = '1613110712292812|k9j4h1sAQDpNCwcuZXKp_I1SKu8';
	$ionicPlatform.PAGEID = '158259371219';//'150117738356335';
	$ionicPlatform.TIMEREFRESH = 60*60; //min= n * 60
	
    $ionicPlatform.ready(function() {
						
		//ABILITIAMO L'APP AL FUNZIONAMENTO IN BACKGROUND												
		cordova.plugins.backgroundMode.setDefaults({ 
            silent: true, 
            title:  'Jumping', 
            text:   'L\' app funzionerà in background',
            ticker: 'Jumping' 
        });
        cordova.plugins.backgroundMode.enable();
				
		//check nuove notizie
		backgrdNotification.backgrdCheckOnFb();
		
		//Pulisco le notifiche all'apertura
		backgrdNotification.backgrdClearNot();	
		
		cordova.plugins.backgroundMode.onfailure = function(errorCode) {alert('errore')};

		//Chiamo subito il metodo per issue primo avvio
		//cordova.plugins.backgroundMode.ondeactivate();
					
		//Nascondo splash screen
		$cordovaSplashscreen.hide();	
		
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        
        document.addEventListener("resume", onResume, false);                
                
        //alert($cordovaNetwork.getNetwork());

		
    });
    
    function onResume() {
        
        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);
        
        ionicMaterialInk.displayEffect();
        
        $rootScope.getInfoFB();
    }
      
})
	
.service('backgrdNotification', function($ionicPlatform, $timeout, ngFB) {
  
    this.backgrdClearNot = function() {		
		cordova.plugins.backgroundMode.ondeactivate = function() {			
				cordova.plugins.notification.local.clearAll(function() {
					console.log("cleared");			
					//alert('test');
				}, this);
			}
        }
 
    this.backgrdCheckOnFb = function() {	
		ngFB.init({appId: $ionicPlatform.APPFBID, accessToken: $ionicPlatform.STATICTOKEN});
		cordova.plugins.backgroundMode.onactivate = function() {
			//if (cordova.plugins.backgroundMode.isActive()) { 
				cordova.plugins.backgroundMode.configure({ silent: true });				
				//cordova.plugins.notification.local.schedule({id:1, title: "test!",text: "debug", led: "E8D032"});				
				 var delayedUpdate = function() {			 					
					setTimeout(function () {                   
						
						//preleviamo l'ultimo post da FB										
						var lastId = new Object();
						//cordova.plugins.notification.local.schedule({id:1, title: "test!",text: "debug", led: "E8D032"});
						ngFB.api({
							method: 'GET',											
							path: '/'+ $ionicPlatform.PAGEID +'/posts/',					
							params: {
								fields: 'id,message'
								,limit: '1'						
							}	
						}).then(
							function(posts) { 				
								lastId = posts.data[0].id;
								lastMsg = posts.data[0].message;	

								//Notifichiamo che c'è un nuovo post
								//window.localStorage.setItem('LASTPOSTID','749846598546');
								//cordova.plugins.notification.local.schedule({title: "test!" ,text: "debug\n"+ lastId +'\n'+ window.localStorage.getItem('LASTPOSTID') , led: "E8D032"});								
								
								if (lastId != window.localStorage.getItem('LASTPOSTID') ) {
									window.localStorage.setItem('LASTPOSTID',lastId);
																										
									cordova.plugins.notification.local.schedule({
										id: 2,
										title: "Ci sono novità alla Jumping!",
										text: lastMsg,
										led: "E8D032"
									});
									
									cordova.plugins.notification.local.on("trigger", function(notification) {
										navigator.vibrate(1000);
									});
									
								}
						});
						
						//Richiamiamo la funzione ciclimamente ogni 30 minuti
						delayedUpdate();         
					}, $ionicPlatform.TIMEREFRESH*1000);
				};
					
				delayedUpdate(); 
			}
        //}
	}
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
                //template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-positive-900 flap"><i class="icon ion-clipboard"></i></button>',                
                template: '',
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