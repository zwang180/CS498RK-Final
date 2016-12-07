var app = angular.module('vintageExpo', ['ngRoute', 'vintageControllers', 'vintageServices', 'slickCarousel', 'mm.foundation']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/store/:store_id', {
    templateUrl: 'partials/store.html',
    controller: 'StoreController'
  }).
  when('/item/:item_id', {
    templateUrl: 'partials/item.html',
    controller: 'ItemController'
  }).
  when('/store_list/', {
    templateUrl: 'partials/store_list.html',
    controller: 'StoreListController'
  }).
  when('/account', {
    templateUrl: 'partials/account.html',
    controller: 'AccountController'
  }).
  when('/item_list/:store_id', {
    templateUrl: 'partials/item_list.html',
    controller: 'ItemListController'
  }).
  when('/main', {
    templateUrl: 'partials/main.html',
    controller: 'MainController'
  }).
  when('/register', {
    templateUrl: 'partials/rgst.html',
    controller: 'RegisterController'
  }).
  when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  }).
  when('/register', {
    templateUrl: 'partials/registration.html',
    controller: 'RegisterController'
  }).
  when('/edit_info/:id', {
    templateUrl: 'partials/edit_info.html',
    controller: 'EditInfoController'
  }).
  when('/edit_store/:id', {
    templateUrl: 'partials/edit_store.html',
    controller: 'EditStoreController'
  }).
  when('/add_store', {
    templateUrl: 'partials/add_store.html',
    controller: 'AddStoreController'
  }).
  when('/add_item', {
    templateUrl: 'partials/add_item.html',
    controller: 'AddItemController'
  }).
  when('/edit_item/:id', {
    templateUrl: 'partials/edit_item.html',
    controller: 'EditItemController'
  }).
  otherwise({
    redirectTo: '/main'
  });
}]);

app.run(['$http', function ($http) {
    $http.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
}]);
