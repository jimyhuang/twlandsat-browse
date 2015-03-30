(function($) {

jQuery.fn.twrervoirData = function(){
  $.getJSON('http://jimmyhub.net/fetch.php?path=infographicstw/reservoir-history-crawler/master/data/2003-01-28', function(json){
    console.log(json);
  });

}

})(jQuery);
