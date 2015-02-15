<?php
$base = './processed/';
$dirs = scandir('./processed/');
$available = $nav = array();
foreach($dirs as $d){
  $file = 'processed/'.$d.'/tiles/openlayers.html';
  if($d[0] === 'L' && is_dir($base.$d) && is_file($file)){
    $day = substr($d, 9, 7);
    $year = substr($day, 0, 4);
    $day = substr($day, 4);
    $date = strtotime($year.'-01-01') + 86400*($day-1);
    $date = date('Y-m-d', $date);
    $available[$d] = $date;
  }
}
$landsat = !empty($_GET['landsat']) && $_GET['landsat'][0] === 'L' ? $_GET['landsat'] : key($available);
$date = $availabe[$landsat];
?>
<!DOCTYPE html>
<html>
<head>
  <title>賽豬公上太空計畫</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta property="og:image" content="https://farm3.staticflickr.com/2876/12199837206_100507b5d4_z.jpg" />
  <!-- Meta image from https://www.flickr.com/photos/t_zero/12199837206 cc by-nc-sa -->
  <style type="text/css">
    body { margin:0; background: #EFEFEF;}
    h1, h2, h3, h4, h5, h6 { margin: 0; }
    #page { width: 100%; }
    main { height: 100%; }
    .map { height: auto; min-height: 550px; }
  </style>
  <script src='http://maps.google.com/maps/api/js?sensor=false&v=3.7'></script>
  <script src="http://www.openlayers.org/api/2.12/OpenLayers.js"></script>
  <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
  <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

  <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="http://code.jquery.com/ui/1.11.0/jquery-ui.min.js"></script>
  <script type="text/javascript" src="/js/jquery.ui.touch-punch.min.js"></script> 
  <script type="text/javascript" src="/js/jquery.beforeafter-map-0.11.js"></script>
</head>
<body>
  <div id="page">
    <header id="header">
      <h1>賽豬公上太空 <sup style="font-size: 13px;"><a href="https://github.com/jimyhuang/twlandsat">計畫說明</a></sup></h1>
    </header>
    <main>
      <h3>現正瀏覽：<?php echo $date ?> 衛星空照圖</h3>
      <div id="map-diff">
        <div id="before" class="map"></div>
        <div id="after" class="map"></div>
      </div>
    </main>
  </div> <!--/page-->
<script>
var landsat = '<?php echo $landsat; ?>';
var b, a;
if(landsat.indexOf('|')){
  var landsats = landsat.split('|');
  var b = landsats[0];
  var a = landsats[1];
}
else{
  var b = landsat;
}

// create base params
var attribution = 'Data &copy; <a href="http://landsat.gsfc.nasa.gov/">USGS/NASA Landsat</a> in <a href="http://landsat.gsfc.nasa.gov/?page_id=2339">Public Domain</a>. Images <a href="http://twlandsat.jimmyhub.net">TWLandsat</a>';
var maxZoom = 13;

// create layers

// before and after layer
if(b){
  var before = L.tileLayer(
    'http://twlandsat.jimmyhub.net/processed/'+b+'/tiles/{z}/{x}/{y}.png',
    {
      tms: true,
      attribution: attribution,
      maxZoom: maxZoom,
    }
  );
  var osmb = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });
  var mapb = L.map('before', {
    center: [23.955259, 120.687062],
    zoom: 7,
    maxZoom: 13,
    layers: [osmb, before]
  });
}
if(a){
  var after = L.tileLayer(
    'http://twlandsat.jimmyhub.net/processed/'+a+'/tiles/{z}/{x}/{y}.png',
    {
      tms: true,
      attribution: attribution,
      maxZoom: maxZoom,
    }
  );
  var osma = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });
  var mapa = L.map('after', {
    center: [23.955259, 120.687062],
    zoom: 7,
    maxZoom: 13,
    layers: [osma, after]
  });
}
if(a && b && mapa && mapb){
  jQuery('#map-diff').beforeAfter(mapb, mapa, {
    imagePath: './css/images/',
    animateIntro : true,
    introDelay : 1000,
    introDuration : 1000,
    introPosition : .5,
    showFullLinks : true,
    beforeLinkText: '顯示過去',
    afterLinkText: '顯示未來',
  });
}
</script>
</body>
</html>
