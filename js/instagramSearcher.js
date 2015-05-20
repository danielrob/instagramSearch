var app = angular.module('instagramSearcher', ['ngAnimate']);

app.controller('appController', function ($scope, $http) {

  $scope.search = function(query){
    if (!$scope.query) return // do nothing on empty queries
    resetSearch();
    query = sanitizeQuery(query)
    setMsg("Yo' " + query + " is comin");
    search(query);
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
      console.log(result)
      if (result.meta.code != 200) {
        setMsg("HAHA! You searched " + query + ".")
        return;
      }
      setCount(result)
      setSuccessMsg();
      animate();
      setImages(result);
    })
    .error(function() {
      setSearching(false);
      setMsg("something's wrong man... really wrong.");
    });
  };

  function resetSearch(){
    $scope.shake = undefined;
    $scope.query = undefined;
    $scope.instasearch.$setPristine();
    $scope.instasearch.$setUntouched();
  };

  function sanitizeQuery(query){
    return query.replace(/[^a-zA-Z0-9]/g, '');
  };

  function setMsg(message){
    $scope.msg = message;
  };

  function setSuccessMsg(){
    $scope.count == 0 ?
      setMsg('Got nothin man. Try some real words!') :
      setMsg('Got ' + $scope.count + ' results... coool');
  };

  function setCount(result){
    $scope.count = result.data.length;
  }

  function setImages(result){
    var images = result.data.map(function(img){
      var caption = img.caption == null ? 'captionless' : teaser(img.caption.text);
      return {
        'embed_url': img.images.low_resolution.url,
        'link': img.link,
        'caption': caption
      };
    });
    $scope.images = images;
  };

  function teaser(txt){
    return txt.length < 46 ?
      txt :
      txt.substring(0, 45).replace(/\s+\S*$/, "...");
  };

  function animate(){
    count = $scope.count;
    $scope.shake = (0 < count && count != 20) ? 'shake': '';
  }
});