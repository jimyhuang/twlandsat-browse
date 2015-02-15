<?php
$base = './processed/';
$dirs = scandir('./processed/');
$nav = $list = array();
$location = array(
  '117043' => '北部(117/43)',
  '117044' => '東部(117/44)',
  '117045' => '桃竹苗(117/45)',
  '118044' => '西南沿海(118/44)',
);
foreach($dirs as $d){
  $file = 'processed/'.$d.'/tiles/openlayers.html';
  if($d[0] === 'L' && is_dir($base.$d) && is_file($file)){
    $rawpath = substr($d, 3, 6);
    $day = substr($d, 9, 7);
    $year = substr($day, 0, 4);
    $day = substr($day, 4);
    $date = strtotime($year.'-01-01') + 86400*($day-1);
    $date = date('Y-m-d', $date);
    if(empty($nav[$rawpath]['name'])){
      $nav[$rawpath]['name'] = $location[$rawpath];
    }
    $nav[$rawpath][$d] = $date;
    $list[$d] = array(
      'date' => $date,
      'location' => $location[$rawpath],
      'rawpath' => $rawpath,
    );
  }
}
$landsat = !empty($_GET['landsat']) && $_GET['landsat'][0] === 'L' ? $_GET['landsat'] : '';
list($before, $after) = explode('|', $landsat);
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
  <script type="text/javascript">
    var nav = <?php echo json_encode($nav); ?>;
  </script>
</head>
<body>
  <div id="page">
    <header id="header">
      <h1>賽豬公上太空 <sup style="font-size: 13px;"><a href="https://github.com/jimyhuang/twlandsat">計畫說明</a></sup></h1>
      <nav id="nav">
      </nav>
    </header>
    <main>
      <div id="map-diff">
        <div id="before" class="map"></div>
        <div id="after" class="map"></div>
      </div>
    </main>
  </div> <!--/page-->
<script>
var landsat = '<?php echo $landsat; ?>';
</script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-59775466-1', 'auto');
  ga('send', 'pageview');
</script>
<script type="text/javascript" src="/js/nav.js"></script>
</body>
</html>
