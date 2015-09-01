/* global angular, document, window */
'use strict';

angular.module('starter.controllers', ['ngOpenFB'])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $ionicPopover, $timeout, ngFB) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
	
	////////////////////////////////////////////////
	//            FACEBOOK          ///////////////
	//////////////////////////////////////////////
	
	
	ngFB.init({appId: '1613110712292812', accessToken: '1613110712292812|k9j4h1sAQDpNCwcuZXKp_I1SKu8'});
	
	/*
	$scope.loginFB = function() {		
                ngFB.login({scope: 'email,publish_actions, user_likes'}).then( 
                    function(response) {
                        alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);						
						$scope.fbtoken=response.authResponse.accessToken;
						$scope.getInfoFB();
                    },
                    function(error) {
                        alert('Facebook login failed: ' + JSON.stringify(error));
                    }
					
					);
    }*/
		
	$scope.getInfoFB = function() {		

                ngFB.api({
                    method: 'GET',
                    path: '/150117738356335/posts/',
					params: {
						fields: 'message,created_time,comments,likes'
						,limit: '20'						
					}	
                }).then(
                    function(posts) {               						
                        $scope.posts = posts.data;													                        
						//console.log(JSON.stringify($scope.posts));
						
                    },
                    errorHandler);
    }
	
	
	$scope.revokeFB = function() {				
                ngFB.revokePermissions().then(
                    function() {
                        alert('Permissions revoked');
                    },
                    errorHandler);
    }
	
	 function errorHandler(error) {				
                alert('Err: ' + error.message);
				//$scope.loginFB();
				
     }
	 

})

.controller('LoginCtrl', function($scope,$rootScope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();



})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicPopup, ngFB) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
			
	

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);	 
  
	 $scope.showPopup = function() {
		  $scope.data = {}

		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
			template: this.post.message,
			cssClass: 'dialogExtend',
			//title: 'Enter Wi-Fi Password',		
			scope: $scope,
			buttons: [
			  { text: 'Chiudi',
				type: 'button-positive-900' }
			]
		  });
	};
	  	  
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
		
	$scope.$parent.getInfoFB();		
	
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
