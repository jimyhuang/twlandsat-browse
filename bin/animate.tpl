<!DOCTYPE html>
<html>
<head>
  <title>{title} | 賽豬公上太空計畫</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta property="og:title" content="{title}" />
  <meta property="og:image" content="{image}" />
  <meta name=viewport content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

  <!-- page specific css -->
  <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.4/themes/flick/jquery-ui.css">
  <link rel="stylesheet" href="./vendor/jquery-ui-slider-pips/jquery-ui-slider-pips.css" />
  <link rel="stylesheet" href="./vendor/leaflet-layer-player/src/leaflet-layer-player.css" />

  <!-- override css -->
  <link rel="stylesheet" href="./css/style.css" />

  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
  <script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="//code.jquery.com/ui/1.11.0/jquery-ui.min.js"></script>
  <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="./vendor/jquery.ui.touch-punch/jquery.ui.touch-punch.min.js"></script> 
</head>
<body class="animate">
<div class="navbar-wrapper">
  <div class="container">
    <nav class="navbar navbar-inverse navbar-static-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="./">賽豬公上太空</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="./">首頁</a></li>
            <li><a href="./#content">成果</a></li>
            <li><a href="https://github.com/jimyhuang/twlandsat/blob/master/README.md" target="_blank">關於</a></li>
            <li><a href="https://www.flickr.com/search/?tags=twlandsat" target="_blank">相簿</a></li>
            <li><a href="https://www.facebook.com/groups/610479852418250/" target="_blank">討論</a></li>
            <li><a href="./developer.html">參與</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right share">
            <li><div class="fb-like" data-href="{url}" data-width="180" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</div>
<div class="twlandsat">
  <div class="inner-wrapper">
  </div>
</div>
<div id="content" class="container-fluid">
  <div class="row">
    <div id="animate" class="map"></div>
    <script type="text/javascript" src="./vendor/jquery-ui-slider-pips/jquery-ui-slider-pips.min.js"></script> 
    <script type="text/javascript" src="./vendor/jquery.ui.touch-punch/jquery.ui.touch-punch.min.js"></script> 
    <script type="text/javascript" src="./vendor/leaflet-layer-player/src/leaflet-layer-player.js"></script> 
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
    <script type="text/javascript">
    var json = '{json}';
    var slides = JSON.parse(jsonString);    
    </script>
    <script type="text/javascript">
(function($) {
var re = /([^&=]+)=?([^&]*)/g;
var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};
$.parseParams = function(query) {
    var params = {}, e;
    while ( e = re.exec(query) ) { 
        var k = decode( e[1] ), v = decode( e[2] );
        if (k.substring(k.length - 2) === '[]') {
            k = k.substring(0, k.length - 2);
            (params[k] || (params[k] = [])).push(v);
        }
        else params[k] = v;
    }
    return params;
};
})(jQuery);
jQuery(document).ready(function($){
  var url = window.location.href;
  var params = $.parseParams( url.split('?')[1] || '' ); 
  if(typeof params.profile !== 'undefined'){
    // setup map
    osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    var map_height = $(window).height() - $("header").height() - $("footer").height() - $('.twlandsat').height();
    $(".map").height(map_height);
    baseMap = new L.map('animate', {
      center: slides.center,
      zoom: slides.zoom,
      maxZoom: 13,
      layers: [osm],
      doubleClickZoom: false,
      tap: false
    });

    var server = Math.floor((Math.random() * 3) + 1);
    var layerplayer = L.control.layerPlayer({
      position: 'bottomleft',
      slides: slides,
      tile: 'http://l1.jimmyhub.net/processed/{slide.title}/tiles-rgb/{z}/{x}/{y}.png',
      tms: true,
      attribution: '<a href="http://landsat.gsfc.nasa.gov/">USGS/NASA Landsat</a>. Imagery from <a href="http://nspo.g0v.tw">TWLandsat',
      playInterval: 1000,
      loadingDelay: 4000,
      chart: true
    });
    baseMap.addControl(layerplayer);
  }
});
    </script>
  </div>
  <footer>
    <p class="pull-right"><a href="#">Back to top</a></p>
    <p>
      <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="創用 CC 授權條款" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a> Imagery licensed under <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CreativeCommons by-nc-sa</a>
    </p>
  </footer>
</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-59775466-1', 'auto');
  ga('send', 'pageview');
</script>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&appId=1592598511026958&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
</body>
</html>
