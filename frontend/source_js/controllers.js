var vintageControllers = angular.module('vintageControllers', []);


vintageControllers.controller('StoreController', ['$scope', '$routeParams', '$http', '$window', '$route', 'UserAuth', function($scope, $routeParams, $http, $window, $route, UserAuth) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.id = $routeParams.store_id;
  $http.get('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/' + $scope.id).then(function(res) {
    $scope.store = res.data['data'];
  }, function(res) {
    console.log(res);
  });
  $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/all?where={'belongsTo': '" + $scope.id + "'}").then(function(res) {
    $scope.reviews = res.data['data'];
  }, function(res) {
    console.log(res);
  });
  $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items?where={'belongsTo': '" + $scope.id + "'}").then(function(res) {
    $scope.items = res.data['data'];
  }, function(res) {
    console.log(res);
  })

  $scope.addComment = function() {
    data = {}
    data['content'] = $scope.comment;
    data['belongsTo'] = $scope.id;
    data['user'] = $scope.user.nickname;
    $http.post("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/all", data).then(function(res) {
      $scope.comment = "";
      $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/all?where={'belongsTo': '" + $scope.id + "'}").then(function(res) {
        $scope.reviews = res.data['data'];
      }, function(res) {
        console.log(res);
      });
    }, function(res) {
      console.log(res);
    })
  }
  $scope.logout = function() {
    UserAuth.logOut().then(function(res) {
      $window.sessionStorage.currentUser = null;
      $route.reload();
    })
  }
  $scope.slickConfig = {

      autoplay: true,
      speed: 400,
      //slidesToShow: 1,
      //slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true
          }
        },
        {
          breakpoint: 580,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true
          }
        }
      ]
    };

}]);

vintageControllers.controller('ItemController', ['$scope', '$http', '$routeParams', '$window', '$route', 'UserAuth', function($scope, $http, $routeParams, $window, $route, UserAuth) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.id = $routeParams.item_id;
  $scope.user_favorite = $scope.user.favorite.indexOf($scope.id);
  $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items/" + $scope.id).then(function (response) {
    var allData = response.data;
    $scope.item = allData.data;
  });
  $scope.favorite = function() {
    if($scope.user_favorite == -1) {
      $scope.user.favorite.push($scope.id);
      $http.put("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/update/" + $scope.user._id, $scope.user).then(function(res) {
        $window.sessionStorage.currentUser = angular.toJson(res.data['data']);
        $scope.user = res.data['data'];
        $scope.user_favorite = $scope.user.favorite.indexOf($scope.id);
        $('#favorite-text').text("Added");
        $('#favorite-button').attr("disabled", true);
      }, function(res) {
        console.log(res);
      })
    }
    $scope.logout = function() {
      UserAuth.logOut().then(function(res) {
        $window.sessionStorage.currentUser = null;
        $route.reload();
      })
    }

  }
  $scope.slickConfig = {

      autoplay: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1
    };

}]);

vintageControllers.controller('ItemListController', ['$scope', '$window', '$http', '$routeParams', '$route', '$location', 'UserAuth', function($scope, $window, $http, $routeParams, $route, $location, UserAuth) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.id = $routeParams.store_id;
  $scope.type = "";
  $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/" + $scope.id).then(function(response) {
    $scope.store = response.data['data'];
  })
  $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items?where={'belongsTo': '" + $scope.id + "'}").then(function(response) {
    var allItems = response.data;
    $scope.items = allItems.data;
  }, function(res) {
    console.log(res);
  });
  $scope.delete = function(id) {
    $http.delete("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items/" + id).then(function(res) {
      $location.path('/item_list/' + $scope.id);
    }, function(res) {
      console.log(res);
    })
  }
  $scope.logout = function() {
    UserAuth.logOut().then(function(res) {
      $window.sessionStorage.currentUser = null;
      $route.reload();
    })
  }
}]);


vintageControllers.controller('AccountController', ['$scope', '$http', '$window', '$route', 'UserAuth', function($scope, $http, $window, $route, UserAuth) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.favorite = $scope.user.favorite;
  if($scope.favorite.length) {
    $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items?where={'_id': {'$in': " + JSON.stringify($scope.favorite) + "}}").then(function(res) {
      $scope.favorites = res.data['data'];
    })
  }
  if($scope.user.ownerof) {
    $http.get("http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/" + $scope.user.ownerof).then(function(res) {
      $scope.store = res.data['data'];
    }, function(res) {
      console.log(res);
    });
  }
  $scope.logout = function() {
    UserAuth.logOut().then(function(res) {
      $window.sessionStorage.currentUser = null;
      $route.reload();
    })
  }
}]);

vintageControllers.controller('MainController', ['$scope', '$http', '$location', '$window', '$route', 'UserAuth', function($scope, $http, $location, $window, $route, UserAuth) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.name = "";
  $scope.city = "";
  $http.get('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores?limit=5').then(function(res) {
    $scope.stores = res.data['data'];
  })
  $scope.logout = function() {
    UserAuth.logOut().then(function(res) {
      $window.sessionStorage.currentUser = null;
      $route.reload();
    })
  }

}]);

vintageControllers.controller('RegisterController', ['$scope', '$location', '$window', 'UserAuth' , function($scope, $location, $window, UserAuth) {
  $scope.addUser = function() {
    if($scope.register_form.$valid) {
      UserAuth.register($scope.username, $scope.password, $scope.email, $scope.nickname).then(function(res) {
        $window.sessionStorage.currentUser = angular.toJson(res.data['data']);
        $location.path('/main');
      }, function(res) {
        console.log(res.data["message"]);
      })
    }
    else {
      console.log("Not Valid!");
    }
  }
}]);

vintageControllers.controller('StoreListController', ['$scope' , '$window', '$http', '$route', 'UserAuth', function($scope, $window, $http, $route, UserAuth) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $http.get('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/?limit=5').then(function(res) {
    $scope.stores = res.data['data'];
  })
  $scope.orderby = "name";
  $scope.orders = false;
  $scope.logout = function() {
    UserAuth.logOut().then(function(res) {
      $window.sessionStorage.currentUser = null;
      $route.reload();
    })
  }

}]);

vintageControllers.controller('LoginController', ['$scope' , '$location', '$window', 'UserAuth', function($scope, $location, $window, UserAuth) {
  $scope.login = function() {
    UserAuth.logIn($scope.username, $scope.password).then(function(res) {
      $location.path('/main');
      $window.sessionStorage.currentUser = angular.toJson(res.data['data']);
      $scope.username = "";
      $scope.password = "";
    }, function(res) {
      console.log(res.data['message']);
    });
  };
}]);

vintageControllers.controller('EditInfoController', ['$scope' , '$location', '$window', '$http', function($scope, $location, $window, $http) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.nickname = $scope.user.nickname;
  $scope.email = $scope.user.email;
  $scope.editUser = function() {
    var updateUser = $scope.user;
    updateUser.nickname = $scope.nickname;
    updateUser.email = $scope.email;
    $http.put('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/update/' + $scope.user._id, updateUser).then(function(res) {
      $window.sessionStorage.currentUser = angular.toJson(res.data['data']);
      $location.path('/account');
    }, function(res) {
      console.log(res);
    });
  }
}]);

vintageControllers.controller('EditStoreController', ['$scope' , '$location', '$window', '$http','$routeParams', function($scope, $location, $window, $http, $routeParams) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.id = $routeParams.id;
  $http.get('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/' + $scope.id).then(function(res) {
    $scope.store = res.data['data'];
  }, function(res) {
    console.log(res);
  })
  $scope.editStore = function() {
    $http.put('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/' + $scope.store._id, $scope.store).then(function(res) {
      $location.path('/store/' + $scope.id);
    }, function(res) {
      console.log(res);
    });
  }
}]);

vintageControllers.controller('AddStoreController', ['$scope' , '$location', '$window', '$http','$routeParams', function($scope, $location, $window, $http, $routeParams) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.store = {};
  $scope.store.contact = {};
  $scope.store.owner = $scope.user._id;
  $scope.store.ownerName = $scope.user.username;
  $scope.addStore = function() {
    $http.post('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/stores/', $scope.store).then(function(res) {
      var store = res.data['data'];
      var user = $scope.user;
      user.ownerof = store._id;
      $http.put('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/update/' + $scope.user._id, user).then(function(res) {
        $window.sessionStorage.currentUser = angular.toJson(res.data['data']);
        $location.path('/store/' + store._id);
      }, function(res) {
        console.log(res);
      })
    }, function(res) {
      console.log(res);
    });
  }
}]);

vintageControllers.controller('AddItemController', ['$scope' , '$location', '$window', '$http', function($scope, $location, $window, $http) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.item = {};
  $scope.addItem = function() {
    $scope.item.belongsTo = $scope.user.ownerof;
    $http.post('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items/', $scope.item).then(function(res) {
      var item = res.data['data'];
      $location.path('/item_list/' + $scope.user.ownerof);
    }, function(res) {
      console.log(res);
    });
  }
}]);

vintageControllers.controller('EditItemController', ['$scope' , '$location', '$window', '$http','$routeParams', function($scope, $location, $window, $http, $routeParams) {
  $scope.user = angular.fromJson($window.sessionStorage.currentUser);
  $scope.id = $routeParams.id;
  $http.get('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items/' + $scope.id).then(function(res) {
    $scope.item = res.data['data'];
  })
  $scope.editItem = function() {
    $http.put('http://fa16-cs498rk-090.cs.illinois.edu:5000/api/items/' + $scope.id, $scope.item).then(function(res) {
      var item = res.data['data'];
      $location.path('/item/' + item._id);
    }, function(res) {
      console.log(res);
    });
  }
}]);
