var app = angular.module('instagramSearcher', ['ngAnimate']);

app.controller('appController', function ($scope, $http) {

  // Searching
  $scope.search = function(query){
    query = sanitizeQuery(query)
    if (!query) return
    $scope.lastSearch = query;
    resetSearch();
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
      setImages(result);
      playGame();
    })
    .error(function() {
      setMsg("something's wrong man... really wrong.");
    });
  };

  function resetSearch(){
    $scope.shake = undefined;
    $scope.query = undefined;
    $scope.captionless = 0;
    $scope.count = undefined;
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
      var caption = img.caption == null ? noCaption() : teaser(img.caption.text);
      return {
        'embed_url': img.images.low_resolution.url,
        'link': img.link,
        'caption': caption
      };
    });
    $scope.images = images;
  };

  function noCaption(){
    $scope.captionless += 1;
    return 'captionless!'
  }

  function teaser(txt){
    return txt.length < 46 ?
      txt :
      txt.substring(0, 45).replace(/\s+\S*$/, "...");
  };

  // Gaming //TODO: move to seperate controller. 
  // Initialisation
  $scope.mode = 'Searcher.'
  var searchCount = 0;
  $scope.topScore = 0;
  var searches; zeroGame();

  // Initial setup & after every loss
  function zeroGame(){
    updateTopScore();
    $scope.gameScore = {
      'instawhacks':0,
      'belowTwenty':0,
      'gotTwenty':0,
      'maxbreach':0,
      'captionless':0
    };
    searches = [];
  };

  // 'Public Function' relies on: $scope.count, $scope.captionless, $scope.lastSearch from Search scope.
  function playGame(){
    searchCount += 1;
    if (gameOver() || existingSearch()) return;
    updateGameMode();
    updateScoring();
    playAnimations();
  }

  function gameOver(){
    // Limit game to 20 plays for beginners luck, 10 thereafter.
    if (searchCount > 19) {
      updateScoring();
      setMsg("Ten searches till game over!")
      endGame();
      return true;
    };
    // If no results were returned, you lose.
    if ($scope.count == 0) {
      endGame();    
      // For a friend
      if ($scope.lastSearch == "Capitaineisthegreatest") 
        setMsg('Capitaine IS The Greatest');
      return true;
    } else {
      return false;
    };
  };

  function endGame(){
    updateGameMode(true); //show this rounds score
    zeroGame(); // updates top score
    searchCount = searchCount > 10 ? 10 : searchCount;
  }

  function existingSearch(){
    if (searches.indexOf($scope.lastSearch) == -1) {
       searches.push($scope.lastSearch);
       return false;
    } else {
      if (searchCount >= 5) setMsg('Not again. Repeat search yo!');
      return true;
    };
  };

  // Change front page text over time.
  function updateGameMode(lost){
    if (searchCount > 2) $scope.mode = 'Search onn....'
    if (searchCount > 4) $scope.mode = 'Searchgamer.'
    if (searchCount > 10) $scope.mode = 'Gamer.'
    if (searchCount > 4 && lost) {
      $scope.gameScore.total = $scope.gameScore.total || 0;
      $scope.mode = $scope.gameScore.total + '! Play Again!';
    }
  };

  function updateScoring(){
    // Count based scoring
    var count = $scope.count;
    switch(true) {
      case (count == 1):
        $scope.gameScore.instawhacks += 5000;
        break;
      case (1 < count && count < 20):
        $scope.gameScore.belowTwenty += 500;
        break;
      case (count == 20):
        $scope.gameScore.gotTwenty +=10;
        break;
      case ($scope.count > 20):
        $scope.gameScore.maxbreach += 10000;
        break;
    }
    // Captionless based scoring
    if ($scope.captionless) $scope.gameScore.captionless += (5000 * captionless);
    // Total
    setTotalScore();
  };

  function setTotalScore(){
    delete $scope.gameScore.total;
    var total = 0;
    for (var property in $scope.gameScore) {
      if ($scope.gameScore.hasOwnProperty(property)) {
        total += $scope.gameScore[property];
      }
    }
    $scope.gameScore.total = total;
  };

  function updateTopScore(){
    if ($scope.gameScore && ($scope.topScore < $scope.gameScore.total)) {
      $scope.topScore = $scope.gameScore.total;
    };
  };

  function playAnimations(){
    var count = $scope.count;
    $scope.shake = ((0 < count && count != 20) || $scope.captionless)
     ? 'shake': '';
  };
});