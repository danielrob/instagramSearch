var app = angular.module('instagramSearcher', []);

app.controller('appController', ['$scope', function ($scope) {
  $scope.helloworld = 'appController says hello world';
}])