var myApp = angular.module('myApp', ['ngRoute', 'angulartics', 'angulartics.google.analytics']);



myApp.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'parts/home.html',
            controller: 'home'
        })
        //about
        .when('/about', {
            templateUrl: 'parts/about.html',
            controller: 'about'
        })
        //portfolio
        .when('/portfolio', {
            templateUrl: 'parts/portfolio.html',
            controller: 'portfolio'
        })

    //blog
    .when('/blog', {
        templateUrl: "parts/blog.html",
        controller: 'blogpost'
    })

    .when('/blog/post', {
            templateUrl: "parts/blogpost.html",
            controller: 'blogpost'
        })
        .when('/blog/admin', {
            templateUrl: "parts/ad.html",
            controller: 'blogpost'
        })
        .when('/blog/adminblog', {
            templateUrl: "parts/admin.html",
            controller: 'blogpost',
            resolve: {
                properties: function checkLoggedIn($q, $http, $location, $rootScope) {
                    var deferred = $q.defer();

                    $http.get('/loggedin')
                        .success(function(user) {
                            if (user != '0') {
                                $rootScope.currentUser = user;
                                deferred.resolve();
                            } else {
                                $rootScope.currentUser = null;
                                deferred.reject();
                                $location.url('blog/admin');
                            }
                        })
                    return deferred.promise;
                }
            }

        })
        //contact
        .when('/contact', {
            templateUrl: 'parts/contact.html',
            controller: 'contact'
        });


});
myApp.controller('blogpost', function($scope, $http, $location, $rootScope, $q) {





    $scope.newpost = function(post) {

        $http.post('api/post', post);
        getall();

    }
    $scope.deletepost = function(id) {
        $http.delete('api/post/' + id);
        getall();
    }
    $scope.update = function(post) {
        $http.put('/api/post/' + post._id, post);
        getall();
    }
    $scope.edit = function(id) {
        $http.get('/api/post/' + id)
            .success(function(post) {
                $scope.post = post;
            })
    }
    getall();

    function getall() {
        $http.get('api/post')
            .success(function(posts) {
                $scope.posts = posts;
            });
    };

    function checkLoggedIn($q, $http, $location, $rootScope) {
        var deferred = $q.defer();

        $http.get('/loggedin')
            .success(function(user) {
                if (user != '0') {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    $rootScope.currentUser = null;
                    deferred.reject();
                    $location.url('/');
                }
            })
        return deferred.promise;
    }

});
myApp.controller('blog', function($scope, $http) {
    console.log('blog');





});
myApp.controller('portfolio', function($scope, $http) {

    $http.get('product.json').success(function(data) {
        console.log('success');
        $scope.product = data.products;
        console.log($scope.product);
    })


});
myApp.controller('blog', function($scope, $routeParams) {



});
myApp.controller('home', function($scope, $routeParams) {

    $(document).ready(function() {
        $skils = $('.skl');
        var i = $skils.length;

        $skils.each(function(i) {
            setInterval(function() {
                $($skils).eq(i).fadeIn('slow');

            }, (i + 1) * 350);
        })



    })



});