/**
 * Created by brandonj on 10/6/15.
 */

angular.module('budget.ui', [
    'ngSanitize',
    'ngAnimate',
    'pascalprecht.translate',
    'ui.bootstrap',
	'ui.slider',
	'ui.router'
])
    .config([
        '$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, $httpProvider) {

            // Allows cross-domain api request / response
            $httpProvider.defaults.useXDomain = true;


            $locationProvider.hashPrefix(''); // Removes index.html in URL
            $locationProvider.html5Mode({enabled: true, requireBase: false});

            $urlRouterProvider.otherwise('/'); //redirects undefined states to /
			$urlRouterProvider.when('/account/view/:accountId', '/account/view/:accountId/transactions');
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home/homeView.html',
                    controller: 'homeViewController',
                    controllerAs: 'vm',
                    stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'home'
		            }
                })
				.state('login', {
					url: '/login',
					templateUrl: 'views/login/loginView.html',
					stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'home'
		            }
				})
				.state('signup', {
					url: '/signup',
					templateUrl: 'views/signup/signupView.html',
					stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'home'
		            }
				})
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard/dashboardView.html',
                    controller: 'dashboardController',
                    controllerAs: 'vm',
                    stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'dashboard'
		            }
                })
				.state('account', {
					url: '/account',
					templateUrl: 'views/account/accountView.html',
					controller: 'accountController',
					controllerAs: 'vm',
					stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'account'
		            }
				})
				.state('account.create', {
					url: '/create',
					templateUrl: 'views/account/create/createAccountView.html',
					controller: 'createAccountController',
					controllerAs: 'vm',
					stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'account'
		            }
				})
				.state('account.view', {
					url: '/view/:accountId',
					templateUrl: 'views/account/view/viewAccountView.html',
					controller: 'viewAccountController',
					controllerAs: 'vm',
					stateLabel: 'budget.TITLE',
					abstract: true
				})
				.state('account.view.transactions', {
					url: '/transactions',
					templateUrl: 'views/account/view/transactions/accountTransactionsView.html',
					controller: 'accountTransactionsController',
					controllerAs: 'vm',
					stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'account'
		            }
				})
				.state('account.view.budget', {
					url: '/budget',
					templateUrl: 'views/account/view/budget/accountBudgetView.html',
					controller: 'accountBudgetController',
					controllerAs: 'vm',
					stateLabel: 'budget.TITLE',
		            params: {
			            navParent: 'account'
		            }
				})
                ;


            // Configure translations
            // TODO: Update language keys section appropriately. See https://angular-translate.github.io/docs/#/guide/09_language-negotiation
            $translateProvider
                .useStaticFilesLoader({
                    prefix: 'i18n/',
                    suffix: '.json'
                })
                .registerAvailableLanguageKeys(['en'], {
                    'pseudo': 'pseudo',
                    'en_US': 'en'
                })
                .determinePreferredLanguage()
                .fallbackLanguage('en');

            // Protect from insertion attacks in the translation values.
            $translateProvider.useSanitizeValueStrategy("sanitizeParameters");


        }
    ])
    .run(['$rootScope', '$log', '$state', 'UserService',
        function($rootScope, $log, $state, UserService) {

            $log.debug('run block started');

			// Set the locale when app runs
			UserService.setLocale(UserService.getInUseLocaleKey());

            /*
             * On app load, check is user has a session
             */
            UserService.checkLoggedIn().then(function(response) {

				UserService.setUserData(response);

                if (!response.loggedin) {

					// Need a way to determine where the user was trying to go... let them go directly to login and signup states...
					$state.go("home");

                }

                $rootScope.$broadcast('UserDataLoaded');

            });

        }
    ]);
