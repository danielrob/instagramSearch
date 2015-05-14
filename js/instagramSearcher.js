var app = angular.module('instagramSearcher', []);

app.controller('appController', ['$scope', function ($scope) {
  $scope.search = function(query){
    $scope.query = undefined;
    $scope.instasearch.$setPristine();
    $scope.instasearch.$setUntouched();
    $scope.query_processing = query;
    $scope.searching = true;
    searchInstagram(query);
  };

  function searchInstagram(query){
  };
}])