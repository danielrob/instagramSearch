var app = angular.module('instagramSearcher', []);

app.controller('appController', function ($scope, $http) {

  $scope.search = function(query){
    $scope.resultMsg = undefined;
    $scope.query = undefined;
    $scope.instasearch.$setPristine();
    $scope.instasearch.$setUntouched();
    $scope.query_processing = query;
    setSearching(true);
    search(sanitizeQuery(query));
  };

  function search(query){
    var _url = "https://api.instagram.com/v1/tags/"+query+"/media/recent";
    var _request = {
      callback: "JSON_CALLBACK",
      client_id: "7bebf656f94e4aa398003d50fbf376ff",
      COUNT: 20,
    };

    $http({
      method: 'JSONP',
      url: _url,
      params: _request
    })
    .success(function(result) {
      setSearching(false);
      $scope.resultMsg = setSuccessMsg(result);
      $scope.images = mapResponse(result);
    })
    .error(function() {
      setSearching(false);
      $scope.resultMsg = "something's wrong man... really wrong."
    });
  };

  function setSearching(boolean){
    $scope.searching = boolean;
  }

  function sanitizeQuery(query){
    return query.replace(/\s(.*)/, "");
  }

  function setSuccessMsg(result){
    return result.data.length == 0 ?
      'Got nothin man. Try some real words!' :
      'Got ' + result.data.length + ' results... coool';
  };

  function mapResponse(result){
    return result.data.map(function(img){
      var caption = img.caption == null ? 'captionless' : teaser(img.caption.text);
      return {
        'embed_url': img.images.low_resolution.url,
        'link': img.link,
        'caption': caption
      };
    });
  };

  function teaser(txt){
    return txt.length < 46 ?
      txt :
      txt.substring(0, 45).replace(/\s+\S*$/, "...");
  };
});