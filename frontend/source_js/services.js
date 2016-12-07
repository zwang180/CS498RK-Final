var vintageServices = angular.module('vintageServices', []);


vintageServices.factory('UserAuth', ['$http', function($http) {

    var user = null;

    return {
      logIn : function(username, password) {
        return $http.post('http://localhost:5000/api/login', {
          username: username,
          password: password
        });
      },
      logOut: function() {
        return $http.get('http://localhost:5000/api/logout');
      },
      register: function(username, password, email, nickname) {
        return $http.post('http://localhost:5000/api/register', {
          username: username,
          password: password,
          email: email,
          nickname: nickname
        });
      }
    }
}]);
